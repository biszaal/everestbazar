import { AppFrame } from "@/components/layout/AppFrame";
import { MarketHero } from "@/components/home/MarketHero";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { Browse } from "@/components/home/Browse";
import { HowItWorks } from "@/components/home/HowItWorks";
import { EscrowDemo } from "@/components/home/EscrowDemo";
import { SellerForm } from "@/components/home/SellerForm";
import { AppCTA } from "@/components/home/AppCTA";

export default function HomePage() {
  return (
    <AppFrame>
      <MarketHero />
      <CategoryTiles />
      <Browse />
      <HowItWorks />
      <EscrowDemo />
      <SellerForm />
      <AppCTA />
    </AppFrame>
  );
}
