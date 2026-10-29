import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CrisisSection from "@/components/CrisisSection";
import SolutionBridge from "@/components/SolutionBridge";
import ScrollFeatures from "@/components/ScrollFeatures";
import SmartIndia from "@/components/SmartIndia";
import PlatformSection from "@/components/PlatformSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />
      <Hero />
      <CrisisSection />
      <SolutionBridge />
      <ScrollFeatures />
      <SmartIndia />
      <PlatformSection />
      <Footer />
    </main>
  );
}
