import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Scheme } from "@shared/schema";

export default function InterestRateManagement() {
  const [updatingRates, setUpdatingRates] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const { data: schemes = [], isLoading } = useQuery<Scheme[]>({
    queryKey: ["/api/schemes"],
  });

  const updateRateMutation = useMutation({
    mutationFn: ({ id, rate }: { id: string; rate: string }) =>
      apiRequest("PUT", `/api/schemes/${id}`, { interestRate: rate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schemes"] });
      toast({
        title: "Success",
        description: "Interest rate updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update interest rate",
        variant: "destructive",
      });
    },
  });

  const handleRateUpdate = (schemeId: string, newRate: string) => {
    setUpdatingRates({ ...updatingRates, [schemeId]: newRate });
  };

  const submitRateUpdate = (schemeId: string) => {
    const newRate = updatingRates[schemeId];
    if (newRate && parseFloat(newRate) > 0) {
      updateRateMutation.mutate({ id: schemeId, rate: newRate });
      setUpdatingRates({ ...updatingRates, [schemeId]: "" });
    }
  };

  const depositSchemes = schemes.filter(scheme => scheme.type === "deposit" && scheme.status === "active");
  const loanSchemes = schemes.filter(scheme => scheme.type === "loan" && scheme.status === "active");

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-bank-navy mb-6">Interest Rate Management</h2>
        <div>Loading interest rates...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-2xl font-bold text-bank-navy mb-6" data-testid="text-rates-title">
        Interest Rate Management
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-bank-navy mb-4" data-testid="text-deposit-rates-title">
            Deposit Rates
          </h3>
          <div className="space-y-4">
            {depositSchemes.map((scheme) => (
              <div 
                key={scheme.id} 
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                data-testid={`rate-item-${scheme.id}`}
              >
                <span className="font-medium text-bank-navy" data-testid={`text-rate-scheme-${scheme.id}`}>
                  {scheme.name}
                </span>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    step="0.01"
                    className="w-20"
                    value={updatingRates[scheme.id] || scheme.interestRate}
                    onChange={(e) => handleRateUpdate(scheme.id, e.target.value)}
                    data-testid={`input-rate-${scheme.id}`}
                  />
                  <span className="text-sm text-bank-gray">% p.a.</span>
                  <Button
                    size="sm"
                    onClick={() => submitRateUpdate(scheme.id)}
                    className="bg-bank-blue text-white hover:bg-blue-700"
                    disabled={
                      !updatingRates[scheme.id] || 
                      updatingRates[scheme.id] === scheme.interestRate ||
                      updateRateMutation.isPending
                    }
                    data-testid={`button-update-rate-${scheme.id}`}
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-bank-navy mb-4" data-testid="text-loan-rates-title">
            Loan Rates
          </h3>
          <div className="space-y-4">
            {loanSchemes.map((scheme) => (
              <div 
                key={scheme.id} 
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                data-testid={`rate-item-${scheme.id}`}
              >
                <span className="font-medium text-bank-navy" data-testid={`text-rate-scheme-${scheme.id}`}>
                  {scheme.name}
                </span>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    step="0.01"
                    className="w-20"
                    value={updatingRates[scheme.id] || scheme.interestRate}
                    onChange={(e) => handleRateUpdate(scheme.id, e.target.value)}
                    data-testid={`input-rate-${scheme.id}`}
                  />
                  <span className="text-sm text-bank-gray">% p.a.</span>
                  <Button
                    size="sm"
                    onClick={() => submitRateUpdate(scheme.id)}
                    className="bg-bank-blue text-white hover:bg-blue-700"
                    disabled={
                      !updatingRates[scheme.id] || 
                      updatingRates[scheme.id] === scheme.interestRate ||
                      updateRateMutation.isPending
                    }
                    data-testid={`button-update-rate-${scheme.id}`}
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
