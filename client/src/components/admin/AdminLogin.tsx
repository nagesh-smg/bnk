import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest("POST", "/api/admin/login", credentials);
      toast({
        title: "Login Successful",
        description: "Welcome to Unity Banking Admin Panel",
      });
      onLogin();
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <Shield className="mx-auto text-bank-blue text-4xl mb-4" />
      <h2 className="text-2xl font-bold text-bank-navy mb-2" data-testid="text-admin-login-title">
        Admin Login
      </h2>
      <p className="text-bank-gray mb-6" data-testid="text-admin-login-subtitle">
        Access the administrative panel
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username" className="block text-sm font-medium text-bank-navy mb-2">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
            data-testid="input-username"
          />
        </div>

        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-bank-navy mb-2">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
            data-testid="input-password"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-bank-blue text-white hover:bg-blue-700"
          disabled={isLoading}
          data-testid="button-login"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
