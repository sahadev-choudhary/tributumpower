import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AtmosPoleTour from "@/components/atmospole/AtmosPoleTour";
import PoleLightInteractive from "@/components/PoleLightInteractive";
import UrbanCrisisSection from "@/components/UrbanCrisisSection";
import SmartIndia from "@/components/SmartIndia";
import PlatformSection from "@/components/PlatformSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />
      <Hero />
      <AtmosPoleTour />
      <PoleLightInteractive />
      <UrbanCrisisSection />
      <SmartIndia />
      <PlatformSection />
      <Footer />
    </main>
  );
}
