import { useState } from "react";
import { Link } from "wouter";
import { University } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLogin from "@/components/admin/AdminLogin";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Navigation() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleAdminLogin = () => {
    setShowAdminLogin(false);
    window.location.href = "/admin";
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <University className="text-bank-blue text-2xl mr-3" />
                <span className="text-2xl font-bold text-bank-navy">Unity Banking</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link href="/" className="text-bank-navy hover:text-bank-blue px-3 py-2 text-sm font-medium transition-colors" data-testid="link-home">
                  Home
                </Link>
                <a href="#schemes" className="text-bank-gray hover:text-bank-blue px-3 py-2 text-sm font-medium transition-colors" data-testid="link-schemes">
                  Schemes
                </a>
                <a href="#services" className="text-bank-gray hover:text-bank-blue px-3 py-2 text-sm font-medium transition-colors" data-testid="link-services">
                  Services
                </a>
                <a href="#about" className="text-bank-gray hover:text-bank-blue px-3 py-2 text-sm font-medium transition-colors" data-testid="link-about">
                  About
                </a>
                <Link href="/branches" className="text-bank-gray hover:text-bank-blue px-3 py-2 text-sm font-medium transition-colors" data-testid="link-contact">
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowAdminLogin(true)}
                className="bg-bank-blue text-white hover:bg-blue-700"
                size="sm"
                data-testid="button-admin-login"
              >
                Admin Login
              </Button>
              <Button 
                className="bg-bank-green text-white hover:bg-green-700"
                size="sm"
                data-testid="button-customer-login"
              >
                Customer Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="sm:max-w-md">
          <AdminLogin onLogin={handleAdminLogin} />
        </DialogContent>
      </Dialog>
    </>
  );
}
