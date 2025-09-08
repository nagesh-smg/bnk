import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Scheme, InsertScheme } from "@shared/schema";

export default function SchemeManagement() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [formData, setFormData] = useState<InsertScheme>({
    name: "",
    type: "deposit",
    description: "",
    interestRate: "",
    minAmount: "",
    maxAmount: "",
    tenure: "",
    status: "active",
  });
  const { toast } = useToast();

  const { data: schemes = [], isLoading } = useQuery<Scheme[]>({
    queryKey: ["/api/schemes"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertScheme) => apiRequest("POST", "/api/schemes", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schemes"] });
      setShowDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "Scheme created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create scheme",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertScheme> }) =>
      apiRequest("PUT", `/api/schemes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schemes"] });
      setShowDialog(false);
      setEditingScheme(null);
      resetForm();
      toast({
        title: "Success",
        description: "Scheme updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update scheme",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/schemes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schemes"] });
      toast({
        title: "Success",
        description: "Scheme deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete scheme",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "deposit",
      description: "",
      interestRate: "",
      minAmount: "",
      maxAmount: "",
      tenure: "",
      status: "active",
    });
    setEditingScheme(null);
  };

  const handleEdit = (scheme: Scheme) => {
    setEditingScheme(scheme);
    setFormData({
      name: scheme.name,
      type: scheme.type,
      description: scheme.description,
      interestRate: scheme.interestRate,
      minAmount: scheme.minAmount || "",
      maxAmount: scheme.maxAmount || "",
      tenure: scheme.tenure,
      status: scheme.status,
    });
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingScheme) {
      updateMutation.mutate({ id: editingScheme.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this scheme?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-bank-navy mb-6">Scheme Management</h2>
        <div>Loading schemes...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-bank-navy" data-testid="text-scheme-management-title">
          Scheme Management
        </h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              className="bg-bank-blue text-white hover:bg-blue-700"
              onClick={() => {
                resetForm();
                setShowDialog(true);
              }}
              data-testid="button-add-scheme"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Scheme
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingScheme ? "Edit Scheme" : "Add New Scheme"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Scheme Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="input-scheme-name"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger data-testid="select-scheme-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="loan">Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  data-testid="textarea-scheme-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    required
                    data-testid="input-scheme-rate"
                  />
                </div>
                <div>
                  <Label htmlFor="tenure">Tenure</Label>
                  <Input
                    id="tenure"
                    value={formData.tenure}
                    onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                    required
                    data-testid="input-scheme-tenure"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minAmount">
                    {formData.type === "deposit" ? "Min Amount" : "Min Amount"}
                  </Label>
                  <Input
                    id="minAmount"
                    value={formData.minAmount || ""}
                    onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                    data-testid="input-scheme-min-amount"
                  />
                </div>
                <div>
                  <Label htmlFor="maxAmount">
                    {formData.type === "deposit" ? "Max Amount" : "Max Amount"}
                  </Label>
                  <Input
                    id="maxAmount"
                    value={formData.maxAmount || ""}
                    onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                    data-testid="input-scheme-max-amount"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger data-testid="select-scheme-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDialog(false)}
                  data-testid="button-cancel-scheme"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-bank-blue text-white hover:bg-blue-700"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-scheme"
                >
                  {editingScheme ? "Update" : "Create"} Scheme
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-bank-navy">Scheme Name</th>
              <th className="text-left py-3 px-4 font-semibold text-bank-navy">Type</th>
              <th className="text-left py-3 px-4 font-semibold text-bank-navy">Interest Rate</th>
              <th className="text-left py-3 px-4 font-semibold text-bank-navy">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-bank-navy">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schemes.map((scheme) => (
              <tr key={scheme.id} data-testid={`row-scheme-${scheme.id}`}>
                <td className="py-4 px-4 font-medium text-bank-navy" data-testid={`text-scheme-name-${scheme.id}`}>
                  {scheme.name}
                </td>
                <td className="py-4 px-4 text-bank-gray capitalize" data-testid={`text-scheme-type-${scheme.id}`}>
                  {scheme.type}
                </td>
                <td className="py-4 px-4 text-bank-gray" data-testid={`text-scheme-rate-${scheme.id}`}>
                  {scheme.interestRate}% p.a.
                </td>
                <td className="py-4 px-4">
                  <Badge 
                    className={scheme.status === "active" ? "bg-bank-green text-white" : "bg-gray-500 text-white"}
                    data-testid={`badge-scheme-status-${scheme.id}`}
                  >
                    {scheme.status}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(scheme)}
                      className="text-bank-blue hover:text-blue-700"
                      data-testid={`button-edit-scheme-${scheme.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(scheme.id)}
                      className="text-bank-red hover:text-red-700"
                      data-testid={`button-delete-scheme-${scheme.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
