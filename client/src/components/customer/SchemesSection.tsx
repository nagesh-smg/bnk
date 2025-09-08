import { useQuery } from "@tanstack/react-query";
import { PiggyBank, HandHelping } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Scheme } from "@shared/schema";

export default function SchemesSection() {
  const { data: schemes = [], isLoading } = useQuery<Scheme[]>({
    queryKey: ["/api/schemes"],
  });

  const depositSchemes = schemes.filter(scheme => scheme.type === "deposit" && scheme.status === "active");
  const loanSchemes = schemes.filter(scheme => scheme.type === "loan" && scheme.status === "active");

  if (isLoading) {
    return (
      <section id="schemes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-bank-navy mb-4">Our Banking Schemes</h2>
            <div className="text-xl text-bank-gray">Loading schemes...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="schemes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-bank-navy mb-4" data-testid="text-schemes-title">
            Our Banking Schemes
          </h2>
          <p className="text-xl text-bank-gray max-w-3xl mx-auto" data-testid="text-schemes-subtitle">
            Choose from our comprehensive range of deposit and loan schemes designed to meet your financial goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Deposit Schemes */}
          <div>
            <div className="flex items-center mb-8">
              <PiggyBank className="text-bank-green text-3xl mr-4" />
              <h3 className="text-2xl font-bold text-bank-navy" data-testid="text-deposit-schemes-title">
                Deposit Schemes
              </h3>
            </div>
            
            <div className="space-y-6">
              {depositSchemes.map((scheme) => (
                <div 
                  key={scheme.id}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                  data-testid={`card-deposit-scheme-${scheme.id}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-semibold text-bank-navy" data-testid={`text-scheme-name-${scheme.id}`}>
                      {scheme.name}
                    </h4>
                    <Badge className="bg-bank-green text-white" data-testid={`badge-scheme-rate-${scheme.id}`}>
                      {scheme.interestRate}% p.a.
                    </Badge>
                  </div>
                  <p className="text-bank-gray mb-4" data-testid={`text-scheme-description-${scheme.id}`}>
                    {scheme.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-bank-gray">Min Amount:</span>
                      <span className="font-semibold text-bank-navy ml-2" data-testid={`text-scheme-min-amount-${scheme.id}`}>
                        {scheme.minAmount}
                      </span>
                    </div>
                    <div>
                      <span className="text-bank-gray">Tenure:</span>
                      <span className="font-semibold text-bank-navy ml-2" data-testid={`text-scheme-tenure-${scheme.id}`}>
                        {scheme.tenure}
                      </span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-bank-blue text-white hover:bg-blue-700"
                    data-testid={`button-apply-scheme-${scheme.id}`}
                  >
                    Apply Now
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Loan Schemes */}
          <div>
            <div className="flex items-center mb-8">
              <HandHelping className="text-bank-blue text-3xl mr-4" />
              <h3 className="text-2xl font-bold text-bank-navy" data-testid="text-loan-schemes-title">
                Loan Schemes
              </h3>
            </div>

            <div className="space-y-6">
              {loanSchemes.map((scheme) => (
                <div 
                  key={scheme.id}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                  data-testid={`card-loan-scheme-${scheme.id}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-semibold text-bank-navy" data-testid={`text-scheme-name-${scheme.id}`}>
                      {scheme.name}
                    </h4>
                    <Badge className="bg-bank-blue text-white" data-testid={`badge-scheme-rate-${scheme.id}`}>
                      {scheme.interestRate}% p.a.
                    </Badge>
                  </div>
                  <p className="text-bank-gray mb-4" data-testid={`text-scheme-description-${scheme.id}`}>
                    {scheme.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-bank-gray">Max Amount:</span>
                      <span className="font-semibold text-bank-navy ml-2" data-testid={`text-scheme-max-amount-${scheme.id}`}>
                        {scheme.maxAmount}
                      </span>
                    </div>
                    <div>
                      <span className="text-bank-gray">Tenure:</span>
                      <span className="font-semibold text-bank-navy ml-2" data-testid={`text-scheme-tenure-${scheme.id}`}>
                        {scheme.tenure}
                      </span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-bank-green text-white hover:bg-green-700"
                    data-testid={`button-apply-scheme-${scheme.id}`}
                  >
                    Apply Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
