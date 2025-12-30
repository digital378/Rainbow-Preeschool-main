import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { initGA, initGlobalFormTracking } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { useScrollRevealOnRoute } from "./hooks/use-scroll-reveal";
import "@/styles/scroll-reveal.css";

import Home from "@/pages/home";
import About from "@/pages/about";
import Programmes from "@/pages/programmes";
import ProgrammeLanding from "@/pages/programme-landing";
import PlaygroupLanding from "@/pages/playgroup-landing";
import NurseryLanding from "@/pages/nursery-landing";
import KindergartenLanding from "@/pages/kindergarten-landing";
import KidsActivityClubLanding from "@/pages/kids-activity-club-landing";
import SummerCampLanding from "@/pages/summer-camp-landing";
import HappyTimesLanding from "@/pages/happy-times-landing";
import Contact from "@/pages/contact";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import NotFound from "@/pages/not-found";

// Local Playgroup Pages (Standalone Landing Pages)
import {
  PlaygroupInThane,
  PlaygroupInManpada,
  PlaygroupInKalwa,
  PlaygroupNearGhodbunderRoad,
  PlaygroupInAnandNagar,
  PlaygroupInKasarvadavali,
  PlaygroupInDhokali,
} from "@/pages/local-playgroup";

// Preschool Centre Landing Pages
import {
  PreschoolInManpada,
  PreschoolInHariniwas,
  PreschoolInAnandNagar,
  PreschoolInDhokali,
  PreschoolInKalwa,
  PreschoolInKasarvadavali,
} from "@/pages/preschool-location";

// Standalone landing page paths (no nav/footer)
const STANDALONE_LANDING_PATHS = [
  "/playgroup-in-thane",
  "/playgroup-in-manpada",
  "/playgroup-in-kalwa",
  "/playgroup-near-ghodbunder-road",
  "/playgroup-in-anand-nagar",
  "/playgroup-in-kasarvadavali",
  "/playgroup-in-dhokali",
];

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    if (!location.includes('#')) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location]);
  
  return null;
}

function Router() {
  const [location] = useLocation();
  useAnalytics();
  useScrollRevealOnRoute(location);
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/programmes" component={Programmes} />
      <Route path="/playgroup" component={PlaygroupLanding} />
      <Route path="/nursery" component={NurseryLanding} />
      <Route path="/kindergarten" component={KindergartenLanding} />
      <Route path="/kids-activity-club" component={KidsActivityClubLanding} />
      <Route path="/summer-camp" component={SummerCampLanding} />
      <Route path="/happy-times" component={HappyTimesLanding} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      
      {/* Local Playgroup Landing Pages (Standalone - no nav/footer) */}
      <Route path="/playgroup-in-thane" component={PlaygroupInThane} />
      <Route path="/playgroup-in-manpada" component={PlaygroupInManpada} />
      <Route path="/playgroup-in-kalwa" component={PlaygroupInKalwa} />
      <Route path="/playgroup-near-ghodbunder-road" component={PlaygroupNearGhodbunderRoad} />
      <Route path="/playgroup-in-anand-nagar" component={PlaygroupInAnandNagar} />
      <Route path="/playgroup-in-kasarvadavali" component={PlaygroupInKasarvadavali} />
      <Route path="/playgroup-in-dhokali" component={PlaygroupInDhokali} />
      
      {/* Preschool Centre Landing Pages */}
      <Route path="/preschool-in-manpada-thane" component={PreschoolInManpada} />
      <Route path="/preschool-in-hariniwas-thane" component={PreschoolInHariniwas} />
      <Route path="/preschool-in-anand-nagar-thane" component={PreschoolInAnandNagar} />
      <Route path="/preschool-in-dhokali-thane" component={PreschoolInDhokali} />
      <Route path="/preschool-in-kalwa-thane" component={PreschoolInKalwa} />
      <Route path="/preschool-in-kasarvadavali-thane" component={PreschoolInKasarvadavali} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  // Normalize path by removing query parameters for standalone check
  const pathWithoutQuery = location.split("?")[0];
  const isStandaloneLanding = STANDALONE_LANDING_PATHS.includes(pathWithoutQuery);

  // For standalone landing pages, render without nav/footer
  if (isStandaloneLanding) {
    return (
      <>
        <ScrollToTop />
        <Router />
      </>
    );
  }

  // Regular pages with nav and footer
  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Navigation />
      <main className="flex-1">
        <ScrollToTop />
        <Router />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  useEffect(() => {
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
    // Initialize global form tracking for all forms
    initGlobalFormTracking();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="rainbow-preschool-theme">
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
