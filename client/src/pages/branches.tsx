import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Mail, User, Building2, Clock } from "lucide-react";
import Navigation from "@/components/customer/Navigation";
import Footer from "@/components/customer/Footer";
import { Badge } from "@/components/ui/badge";
import type { Branch } from "@shared/schema";

export default function Branches() {
  const { data: branches = [], isLoading } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
  });

  const activeBranches = branches.filter(branch => branch.isActive);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bank-navy to-bank-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Building2 className="mx-auto h-16 w-16 mb-4" />
            <h1 className="text-4xl font-bold mb-4" data-testid="text-branches-title">
              Our Branches
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Visit any of our conveniently located branches for personalized banking services
            </p>
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-bank-blue"></div>
              <p className="mt-4 text-bank-gray">Loading branches...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-bank-navy mb-4">
                  Find a Branch Near You
                </h2>
                <p className="text-bank-gray text-lg">
                  We have {activeBranches.length} branches to serve you better
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeBranches.map((branch) => (
                  <div 
                    key={branch.id}
                    className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                    data-testid={`card-branch-${branch.id}`}
                  >
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-bank-blue/10 rounded-full">
                        <Building2 className="h-8 w-8 text-bank-blue" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-bank-navy" data-testid={`text-branch-name-${branch.id}`}>
                          {branch.name}
                        </h3>
                        <Badge className="bg-bank-blue text-white" data-testid={`badge-branch-code-${branch.id}`}>
                          {branch.code}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-bank-gray mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-bank-navy font-medium" data-testid={`text-branch-address-${branch.id}`}>
                            {branch.address}
                          </p>
                          <p className="text-bank-gray text-sm">
                            {branch.city}, {branch.state} - {branch.pincode}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-bank-gray mr-3" />
                        <a 
                          href={`tel:${branch.phone}`}
                          className="text-bank-blue hover:text-blue-700 font-medium"
                          data-testid={`link-branch-phone-${branch.id}`}
                        >
                          {branch.phone}
                        </a>
                      </div>

                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-bank-gray mr-3" />
                        <a 
                          href={`mailto:${branch.email}`}
                          className="text-bank-blue hover:text-blue-700 font-medium"
                          data-testid={`link-branch-email-${branch.id}`}
                        >
                          {branch.email}
                        </a>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center mb-3">
                        <User className="h-5 w-5 text-bank-gray mr-3" />
                        <div>
                          <p className="font-medium text-bank-navy" data-testid={`text-manager-name-${branch.id}`}>
                            {branch.managerName}
                          </p>
                          <p className="text-sm text-bank-gray">Branch Manager</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <Phone className="h-4 w-4 text-bank-gray mr-3" />
                        <a 
                          href={`tel:${branch.managerPhone}`}
                          className="text-bank-blue hover:text-blue-700 text-sm"
                          data-testid={`link-manager-phone-${branch.id}`}
                        >
                          {branch.managerPhone}
                        </a>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mt-4">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-bank-gray">IFSC:</span>
                            <span className="font-mono text-bank-navy ml-1">{branch.ifscCode}</span>
                          </div>
                          {branch.micr && (
                            <div>
                              <span className="text-bank-gray">MICR:</span>
                              <span className="font-mono text-bank-navy ml-1">{branch.micr}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center text-sm text-bank-green">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Open Mon-Fri: 9:30 AM - 4:30 PM, Sat: 9:30 AM - 1:30 PM</span>
                    </div>
                  </div>
                ))}
              </div>

              {activeBranches.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="mx-auto h-16 w-16 text-bank-gray mb-4" />
                  <h3 className="text-xl font-semibold text-bank-navy mb-2">
                    No Active Branches
                  </h3>
                  <p className="text-bank-gray">
                    Please check back later or contact us for branch information.
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-bank-navy mb-4">
                    Need Help Finding Us?
                  </h3>
                  <p className="text-bank-gray">
                    Contact our customer service team for assistance
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="p-4 bg-bank-blue/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Phone className="h-8 w-8 text-bank-blue" />
                    </div>
                    <h4 className="font-semibold text-bank-navy mb-2">Call Us</h4>
                    <p className="text-bank-blue font-medium">1800-123-4567</p>
                    <p className="text-sm text-bank-gray">Toll Free</p>
                  </div>

                  <div className="text-center">
                    <div className="p-4 bg-bank-blue/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Mail className="h-8 w-8 text-bank-blue" />
                    </div>
                    <h4 className="font-semibold text-bank-navy mb-2">Email Us</h4>
                    <p className="text-bank-blue font-medium">support@unitybanking.com</p>
                    <p className="text-sm text-bank-gray">24/7 Support</p>
                  </div>

                  <div className="text-center">
                    <div className="p-4 bg-bank-blue/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Clock className="h-8 w-8 text-bank-blue" />
                    </div>
                    <h4 className="font-semibold text-bank-navy mb-2">Hours</h4>
                    <p className="text-bank-navy font-medium">Mon-Fri: 9:30 AM - 4:30 PM</p>
                    <p className="text-sm text-bank-gray">Sat: 9:30 AM - 1:30 PM</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}