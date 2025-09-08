import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-bank-blue to-bank-navy text-white py-20">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6" data-testid="text-hero-title">
              Your Trusted Banking Partner
            </h1>
            <p className="text-xl text-blue-100 mb-8" data-testid="text-hero-subtitle">
              Secure banking solutions with competitive interest rates and professional service for all your financial needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-bank-green text-white hover:bg-green-700 px-8 py-3"
                size="lg"
                data-testid="button-open-account"
              >
                Open Account
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-bank-blue px-8 py-3"
                size="lg"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Modern banking and financial services" 
              className="rounded-xl shadow-2xl"
              data-testid="img-hero"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
