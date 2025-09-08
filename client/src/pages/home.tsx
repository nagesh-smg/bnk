import Navigation from "@/components/customer/Navigation";
import HeroSection from "@/components/customer/HeroSection";
import QuickStats from "@/components/customer/QuickStats";
import SchemesSection from "@/components/customer/SchemesSection";
import NewsSection from "@/components/customer/NewsSection";
import Footer from "@/components/customer/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <QuickStats />
      <SchemesSection />
      <NewsSection />
      <Footer />
    </div>
  );
}
