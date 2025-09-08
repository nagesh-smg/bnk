import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Edit2, Save, X, PiggyBank, HandHelping, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Setting } from "@shared/schema";

export default function DashboardStats() {
  const [editingStats, setEditingStats] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const { data: settings = [], isLoading } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      apiRequest("PUT", `/api/settings/${id}`, { value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      setEditingStats({});
      toast({
        title: "Success",
        description: "Dashboard statistics updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update statistics",
        variant: "destructive",
      });
    },
  });

  const dashboardStats = settings.filter(setting => setting.category === "dashboard");

  const getIcon = (key: string) => {
    switch (key) {
      case "total_deposits": return PiggyBank;
      case "active_loans": return HandHelping;
      case "total_customers": return Users;
      case "monthly_growth": return TrendingUp;
      default: return TrendingUp;
    }
  };

  const getColor = (key: string) => {
    switch (key) {
      case "total_deposits": return "text-bank-green";
      case "active_loans": return "text-bank-blue";
      case "total_customers": return "text-bank-green";
      case "monthly_growth": return "text-bank-blue";
      default: return "text-bank-blue";
    }
  };

  const handleEdit = (settingId: string, currentValue: string) => {
    setEditingStats({ ...editingStats, [settingId]: currentValue });
  };

  const handleSave = (settingId: string) => {
    const newValue = editingStats[settingId];
    if (newValue !== undefined) {
      updateMutation.mutate({ id: settingId, value: newValue });
    }
  };

  const handleCancel = (settingId: string) => {
    const newEditing = { ...editingStats };
    delete newEditing[settingId];
    setEditingStats(newEditing);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dashboardStats.map((stat) => {
        const Icon = getIcon(stat.key);
        const isEditing = editingStats[stat.id] !== undefined;
        
        return (
          <div key={stat.id} className="bg-white rounded-xl p-6 shadow-md group">
            <div className="flex items-center justify-between mb-2">
              <Icon className={`${getColor(stat.key)} text-2xl`} />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                {!isEditing ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(stat.id, stat.value)}
                    className="h-6 w-6 text-bank-gray hover:text-bank-blue"
                    data-testid={`button-edit-stat-${stat.key}`}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                ) : (
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSave(stat.id)}
                      className="h-6 w-6 text-bank-green hover:text-green-700"
                      disabled={updateMutation.isPending}
                      data-testid={`button-save-stat-${stat.key}`}
                    >
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCancel(stat.id)}
                      className="h-6 w-6 text-bank-red hover:text-red-700"
                      data-testid={`button-cancel-stat-${stat.key}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-2">
              {isEditing ? (
                <Input
                  value={editingStats[stat.id]}
                  onChange={(e) => setEditingStats({ ...editingStats, [stat.id]: e.target.value })}
                  className="text-2xl font-bold text-bank-navy border-bank-blue"
                  data-testid={`input-stat-${stat.key}`}
                />
              ) : (
                <div 
                  className="text-2xl font-bold text-bank-navy"
                  data-testid={`text-stat-value-${stat.key}`}
                >
                  {stat.value}
                </div>
              )}
            </div>
            
            <div 
              className="text-sm text-bank-gray"
              data-testid={`text-stat-label-${stat.key}`}
            >
              {stat.displayName}
            </div>
          </div>
        );
      })}
    </div>
  );
}