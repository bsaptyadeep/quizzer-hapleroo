import { useMemo } from "react";
import "hapleroo-quizzard/styles.css";
import { useActiveSection } from "./hooks/useActiveSection";
import { useTheme } from "./hooks/useTheme";
import { ApiReference } from "./components/ApiReference";
import { DocsSection } from "./components/DocsSection";
import { FaqSection } from "./components/FaqSection";
import { FeatureGrid } from "./components/FeatureGrid";
import { Hero } from "./components/Hero";
import { LiveDemo } from "./components/LiveDemo";
import { QuickStart } from "./components/QuickStart";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader, NAV_ITEMS } from "./components/SiteHeader";
import { ThemeShowcase } from "./components/ThemeShowcase";

export function App() {
  const { toggleTheme, isDark } = useTheme();
  const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.id), []);
  const activeSection = useActiveSection(sectionIds);

  return (
    <div className="site-page">
      <SiteHeader activeSection={activeSection} onToggleTheme={toggleTheme} isDark={isDark} />
      <Hero />
      <FeatureGrid />
      <LiveDemo />
      <QuickStart />
      <DocsSection />
      <ApiReference />
      <ThemeShowcase />
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
