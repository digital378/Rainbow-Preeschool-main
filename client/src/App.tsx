import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

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
import NotFound from "@/pages/not-found";

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
  useAnalytics();
  
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="rainbow-preschool-theme">
        <TooltipProvider>
          <div className="min-h-screen flex flex-col relative z-10">
            <Navigation />
            <main className="flex-1">
              <ScrollToTop />
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
