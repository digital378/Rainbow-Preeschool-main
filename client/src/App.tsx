import { Switch, Route } from "wouter";
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
import Contact from "@/pages/contact";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";

function Router() {
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/programmes" component={Programmes} />
      <Route path="/playgroup">{() => <ProgrammeLanding programmeSlug="playgroup" />}</Route>
      <Route path="/nursery">{() => <ProgrammeLanding programmeSlug="nursery" />}</Route>
      <Route path="/kindergarten">{() => <ProgrammeLanding programmeSlug="kindergarten" />}</Route>
      <Route path="/kids-activity-club">{() => <ProgrammeLanding programmeSlug="kids-activity-club" />}</Route>
      <Route path="/summer-camp">{() => <ProgrammeLanding programmeSlug="summer-camp" />}</Route>
      <Route path="/happy-times">{() => <ProgrammeLanding programmeSlug="happy-times" />}</Route>
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
