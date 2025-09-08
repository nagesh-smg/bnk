import { useState } from "react";
import { 
  LayoutDashboard, 
  Coins, 
  Percent, 
  Newspaper, 
  FileText, 
  Palette,
  LogOut,
  University,
  PiggyBank,
  HandHelping,
  Users,
  TrendingUp,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SchemeManagement from "./SchemeManagement";
import InterestRateManagement from "./InterestRateManagement";
import NewsManagement from "./NewsManagement";
import DocumentManagement from "./DocumentManagement";
import UserManagement from "./UserManagement";
import BrandingManagement from "./BrandingManagement";
import BranchManagement from "./BranchManagement";
import DashboardStats from "./DashboardStats";
import DashboardNewsCarousel from "./DashboardNewsCarousel";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  onLogout: () => void;
}

type ActiveSection = "dashboard" | "schemes" | "rates" | "news" | "documents" | "branches" | "users" | "branding";

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      onLogout();
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "schemes", label: "Scheme Management", icon: Coins },
    { id: "rates", label: "Interest Rates", icon: Percent },
    { id: "news", label: "News Management", icon: Newspaper },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "branches", label: "Branch Management", icon: Building2 },
    { id: "users", label: "User Management", icon: Users },
    { id: "branding", label: "Branding & Logo", icon: Palette },
  ];

  const stats = [
    { 
      label: "Total Deposits", 
      value: "₹12.5 Cr", 
      icon: PiggyBank, 
      color: "text-bank-green" 
    },
    { 
      label: "Active Loans", 
      value: "₹8.2 Cr", 
      icon: HandHelping, 
      color: "text-bank-blue" 
    },
    { 
      label: "Total Customers", 
      value: "2,847", 
      icon: Users, 
      color: "text-bank-green" 
    },
    { 
      label: "Monthly Growth", 
      value: "+15.3%", 
      icon: TrendingUp, 
      color: "text-bank-blue" 
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "schemes":
        return <SchemeManagement />;
      case "rates":
        return <InterestRateManagement />;
      case "news":
        return <NewsManagement />;
      case "documents":
        return <DocumentManagement />;
      case "branches":
        return <BranchManagement />;
      case "users":
        return <UserManagement />;
      case "branding":
        return <BrandingManagement />;
      default:
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-bank-navy mb-2" data-testid="text-dashboard-title">
                Dashboard Overview
              </h1>
              <p className="text-bank-gray" data-testid="text-dashboard-subtitle">
                Manage your banking website and schemes
              </p>
            </div>

            <DashboardStats />

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DashboardNewsCarousel />
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-bank-navy mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setActiveSection("schemes")}
                    className="w-full justify-start bg-bank-blue text-white hover:bg-blue-700"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Add New Scheme
                  </Button>
                  <Button 
                    onClick={() => setActiveSection("news")}
                    className="w-full justify-start bg-bank-green text-white hover:bg-green-700"
                  >
                    <Newspaper className="w-4 h-4 mr-2" />
                    Create News Article
                  </Button>
                  <Button 
                    onClick={() => setActiveSection("users")}
                    className="w-full justify-start bg-bank-gray text-white hover:bg-gray-700"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navigation */}
      <nav className="bg-bank-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <University className="text-2xl mr-3" />
              <span className="text-xl font-bold" data-testid="text-admin-brand">
                Unity Banking - Admin
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm" data-testid="text-admin-welcome">
                Welcome, Admin
              </span>
              <Button 
                onClick={handleLogout}
                className="bg-bank-red text-white hover:bg-red-700"
                size="sm"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Admin Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-bank-navy mb-4">Admin Panel</h3>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as ActiveSection)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === item.id
                      ? "bg-bank-light text-bank-blue"
                      : "text-bank-gray hover:bg-bank-light hover:text-bank-blue"
                  }`}
                  data-testid={`button-nav-${item.id}`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Admin Content Area */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
