import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/home/Footer";

/** Standard page chrome: sticky header, content, footer, and the mobile tab bar. */
export function AppFrame({
  children,
  showFooter = true,
}: {
  children: ReactNode;
  showFooter?: boolean;
}) {
  return (
    <div className="eb-app">
      <a href="#content" className="eb-skip" style={{ position: "absolute", left: -9999, top: 0 }}>
        Skip to content
      </a>
      <SiteHeader />
      <main id="content">{children}</main>
      {showFooter && <Footer />}
      <MobileNav />
    </div>
  );
}
