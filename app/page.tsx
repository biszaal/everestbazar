import { AppFrame } from "@/components/layout/AppFrame";
import { Hero } from "@/components/home/Hero";
import { StatBand } from "@/components/home/StatBand";
import { HowItWorks } from "@/components/home/HowItWorks";
import { EscrowDemo } from "@/components/home/EscrowDemo";
import { Browse } from "@/components/home/Browse";
import { SellerForm } from "@/components/home/SellerForm";
import { AppCTA } from "@/components/home/AppCTA";

export default function HomePage() {
  return (
    <AppFrame>
      <Hero />
      <StatBand />
      <HowItWorks />
      <EscrowDemo />
      <Browse />
      <SellerForm />
      <AppCTA />
    </AppFrame>
  );
}
