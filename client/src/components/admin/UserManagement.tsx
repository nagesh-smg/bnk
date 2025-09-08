import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User as UserType, InsertUser } from "@shared/schema";

export default function UserManagement() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<InsertUser>({
    username: "",
    password: "",
  });
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery<UserType[]>({
    queryKey: ["/api/users"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertUser) => apiRequest("POST", "/api/users", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setShowDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertUser> }) =>
      apiRequest("PUT", `/api/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setShowDialog(false);
      setEditingUser(null);
      resetForm();
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
    });
    setEditingUser(null);
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: "", // Don't pre-fill password for security
    });
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Only include password if it was changed
      const updateData = formData.password 
        ? formData 
        : { username: formData.username };
      updateMutation.mutate({ id: editingUser.id, data: updateData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string, username: string) => {
    if (username === "admin") {
      toast({
        title: "Error",
        description: "Cannot delete the main admin user",
        variant: "destructive",
      });
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-bank-navy mb-6">User Management</h2>
        <div>Loading users...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-bank-navy" data-testid="text-user-management-title">
          User Management
        </h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              className="bg-bank-blue text-white hover:bg-blue-700"
              onClick={() => {
                resetForm();
                setShowDialog(true);
              }}
              data-testid="button-add-user"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  data-testid="input-user-username"
                />
              </div>

              <div>
                <Label htmlFor="password">
                  Password {editingUser && "(leave blank to keep unchanged)"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  data-testid="input-user-password"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDialog(false)}
                  data-testid="button-cancel-user"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-bank-blue text-white hover:bg-blue-700"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-user"
                >
                  {editingUser ? "Update" : "Create"} User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div 
            key={user.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            data-testid={`card-user-${user.id}`}
          >
            <div className="flex items-center mb-4">
              {user.username === "admin" ? (
                <Shield className="text-bank-blue text-2xl mr-3" />
              ) : (
                <User className="text-bank-gray text-2xl mr-3" />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-bank-navy" data-testid={`text-user-username-${user.id}`}>
                  {user.username}
                </h4>
                <Badge 
                  className={user.username === "admin" ? "bg-bank-blue text-white" : "bg-gray-500 text-white"}
                  data-testid={`badge-user-role-${user.id}`}
                >
                  {user.username === "admin" ? "Admin" : "User"}
                </Badge>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(user)}
                className="text-bank-blue hover:text-blue-700"
                data-testid={`button-edit-user-${user.id}`}
              >
                <Edit className="w-4 h-4" />
              </Button>
              {user.username !== "admin" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(user.id, user.username)}
                  className="text-bank-red hover:text-red-700"
                  data-testid={`button-delete-user-${user.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="col-span-full text-center py-8">
            <User className="mx-auto text-bank-gray text-4xl mb-4" />
            <p className="text-bank-gray" data-testid="text-no-users">
              No users found. Create your first user to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}