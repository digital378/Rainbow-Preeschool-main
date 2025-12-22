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
      <Route path="/Playgroup">{() => <ProgrammeLanding programmeSlug="Playgroup" />}</Route>
      <Route path="/Nursery">{() => <ProgrammeLanding programmeSlug="Nursery" />}</Route>
      <Route path="/Kindergarten">{() => <ProgrammeLanding programmeSlug="Kindergarten" />}</Route>
      <Route path="/Kids-Activity-Club">{() => <ProgrammeLanding programmeSlug="Kids-Activity-Club" />}</Route>
      <Route path="/Summer-Camp">{() => <ProgrammeLanding programmeSlug="Summer-Camp" />}</Route>
      <Route path="/Happy-Times">{() => <ProgrammeLanding programmeSlug="Happy-Times" />}</Route>
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
