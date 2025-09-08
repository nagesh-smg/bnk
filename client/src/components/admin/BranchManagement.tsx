import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, MapPin, Phone, Mail, User as UserIcon, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Branch, InsertBranch } from "@shared/schema";

export default function BranchManagement() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState<InsertBranch>({
    name: "",
    code: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    managerName: "",
    managerPhone: "",
    managerEmail: "",
    ifscCode: "",
    micr: "",
    isActive: true,
  });
  const { toast } = useToast();

  const { data: branches = [], isLoading } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertBranch) => apiRequest("POST", "/api/branches", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/branches"] });
      setShowDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "Branch created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create branch",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertBranch> }) =>
      apiRequest("PUT", `/api/branches/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/branches"] });
      setShowDialog(false);
      setEditingBranch(null);
      resetForm();
      toast({
        title: "Success",
        description: "Branch updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update branch",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/branches/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/branches"] });
      toast({
        title: "Success",
        description: "Branch deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete branch",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      managerName: "",
      managerPhone: "",
      managerEmail: "",
      ifscCode: "",
      micr: "",
      isActive: true,
    });
    setEditingBranch(null);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      pincode: branch.pincode,
      phone: branch.phone,
      email: branch.email,
      managerName: branch.managerName,
      managerPhone: branch.managerPhone,
      managerEmail: branch.managerEmail,
      ifscCode: branch.ifscCode,
      micr: branch.micr ?? "",
      isActive: branch.isActive ?? true,
    });
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBranch) {
      updateMutation.mutate({ id: editingBranch.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete branch "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-bank-navy mb-6">Branch Management</h2>
        <div>Loading branches...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-bank-navy" data-testid="text-branch-management-title">
          Branch Management
        </h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              className="bg-bank-blue text-white hover:bg-blue-700"
              onClick={() => {
                resetForm();
                setShowDialog(true);
              }}
              data-testid="button-add-branch"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBranch ? "Edit Branch" : "Add New Branch"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Branch Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="input-branch-name"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Branch Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    data-testid="input-branch-code"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  data-testid="input-branch-address"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    data-testid="input-branch-city"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                    data-testid="input-branch-state"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    required
                    data-testid="input-branch-pincode"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    data-testid="input-branch-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    data-testid="input-branch-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="managerName">Manager Name</Label>
                  <Input
                    id="managerName"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    required
                    data-testid="input-manager-name"
                  />
                </div>
                <div>
                  <Label htmlFor="managerPhone">Manager Phone</Label>
                  <Input
                    id="managerPhone"
                    value={formData.managerPhone}
                    onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                    required
                    data-testid="input-manager-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="managerEmail">Manager Email</Label>
                  <Input
                    id="managerEmail"
                    type="email"
                    value={formData.managerEmail}
                    onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                    required
                    data-testid="input-manager-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                    required
                    data-testid="input-ifsc-code"
                  />
                </div>
                <div>
                  <Label htmlFor="micr">MICR Code</Label>
                  <Input
                    id="micr"
                    value={formData.micr}
                    onChange={(e) => setFormData({ ...formData, micr: e.target.value })}
                    data-testid="input-micr-code"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  data-testid="switch-branch-active"
                />
                <Label htmlFor="isActive">Active Branch</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDialog(false)}
                  data-testid="button-cancel-branch"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-bank-blue text-white hover:bg-blue-700"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-branch"
                >
                  {editingBranch ? "Update" : "Create"} Branch
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {branches.map((branch) => (
          <div 
            key={branch.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            data-testid={`card-branch-${branch.id}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Building2 className="text-bank-blue text-2xl mr-3" />
                <div>
                  <h4 className="font-semibold text-bank-navy" data-testid={`text-branch-name-${branch.id}`}>
                    {branch.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className="bg-bank-gray text-white"
                      data-testid={`badge-branch-code-${branch.id}`}
                    >
                      {branch.code}
                    </Badge>
                    <Badge 
                      className={branch.isActive ? "bg-bank-green text-white" : "bg-gray-500 text-white"}
                      data-testid={`badge-branch-status-${branch.id}`}
                    >
                      {branch.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(branch)}
                  className="text-bank-blue hover:text-blue-700"
                  data-testid={`button-edit-branch-${branch.id}`}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(branch.id, branch.name)}
                  className="text-bank-red hover:text-red-700"
                  data-testid={`button-delete-branch-${branch.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-bank-gray mr-2 mt-0.5" />
                <div>
                  <p className="text-bank-navy" data-testid={`text-branch-address-${branch.id}`}>
                    {branch.address}
                  </p>
                  <p className="text-bank-gray">
                    {branch.city}, {branch.state} - {branch.pincode}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-bank-gray mr-2" />
                <span className="text-bank-navy" data-testid={`text-branch-phone-${branch.id}`}>
                  {branch.phone}
                </span>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-bank-gray mr-2" />
                <span className="text-bank-navy" data-testid={`text-branch-email-${branch.id}`}>
                  {branch.email}
                </span>
              </div>
              
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 text-bank-gray mr-2" />
                <div>
                  <span className="font-medium text-bank-navy" data-testid={`text-manager-name-${branch.id}`}>
                    {branch.managerName}
                  </span>
                  <span className="text-bank-gray ml-2">({branch.managerPhone})</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-xs text-bank-gray">
                  <span>IFSC: <span className="font-mono">{branch.ifscCode}</span></span>
                  {branch.micr && <span>MICR: <span className="font-mono">{branch.micr}</span></span>}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {branches.length === 0 && (
          <div className="col-span-full text-center py-8">
            <Building2 className="mx-auto text-bank-gray text-4xl mb-4" />
            <p className="text-bank-gray" data-testid="text-no-branches">
              No branches found. Create your first branch to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}