import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { initGA, initGlobalFormTracking } from "./lib/analytics";
import { initPixelIfConsented } from "@/lib/cookie-consent";
import { useAnalytics } from "./hooks/use-analytics";
import { useScrollRevealOnRoute } from "./hooks/use-scroll-reveal";
import { setupLinkPrefetching } from "./lib/prefetch";
import "@/styles/scroll-reveal.css";
// Home is eagerly imported (not lazy) so the hero section renders in the first
// JS execution pass — eliminates one Suspense round-trip (~300 ms) from LCP.
import Home from "@/pages/home";

const Footer = lazy(() => import("@/components/footer").then(m => ({ default: m.Footer })));
const ChatWidget = lazy(() => import("@/components/chat-widget").then(m => ({ default: m.ChatWidget })));

const About = lazy(() => import("@/pages/about"));
const Programmes = lazy(() => import("@/pages/programmes"));
const PlaygroupLanding = lazy(() => import("@/pages/playgroup-landing"));
const NurseryLanding = lazy(() => import("@/pages/nursery-landing"));
const KindergartenLanding = lazy(() => import("@/pages/kindergarten-landing"));
const HappyTimesLanding = lazy(() => import("@/pages/happy-times-landing"));
const Contact = lazy(() => import("@/pages/contact"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AdLanding = lazy(() => import("@/pages/ad-landing"));
const AdGoogleLanding = lazy(() => import("@/pages/ad-google-landing"));
const FlyerLanding = lazy(() => import("@/pages/flyer-landing"));
const RISLanding = lazy(() => import("@/pages/ris-landing"));
const RIS11thLanding = lazy(() => import("@/pages/ris-11th-landing"));
const GscDashboard = lazy(() => import("@/pages/gsc-dashboard"));

function GscDashboardWithBoundary() {
  return (
    <ErrorBoundary name="gsc-dashboard">
      <GscDashboard />
    </ErrorBoundary>
  );
}

// Interactive tools & content pages
const ReadinessQuiz = lazy(() => import("@/pages/readiness-quiz"));
const TopPreschoolsThane = lazy(() => import("@/pages/top-preschools-thane"));
const TestimonialsPage = lazy(() => import("@/pages/testimonials"));
const FAQsPage = lazy(() => import("@/pages/faqs"));

// High-intent SEO landing pages
const PreschoolAdmissions = lazy(() => import("@/pages/preschool-admissions"));
const Gallery = lazy(() => import("@/pages/gallery"));
const BestPreschoolInThane = lazy(() => import("@/pages/best-preschool-in-thane"));
const PlaySchoolNearMe = lazy(() => import("@/pages/play-school-near-me"));
const PlaySchoolNearGhodbunderRoad = lazy(() => import("@/pages/play-school-near-ghodbunder-road"));
const PlaySchoolNearMajiwada = lazy(() => import("@/pages/play-school-near-majiwada"));
const PlaySchoolNearNaupada = lazy(() => import("@/pages/play-school-near-naupada"));

const RainbowSparkleTrail = lazy(() => import("@/components/rainbow-sparkle-trail").then(m => ({ default: m.RainbowSparkleTrail })));

const LazyPlaygroupInManpada = lazy(() => import("@/pages/local-playgroup").then(m => ({ default: m.PlaygroupInManpada })));
const LazyPlaygroupInKalwa = lazy(() => import("@/pages/local-playgroup").then(m => ({ default: m.PlaygroupInKalwa })));
const LazyPlaygroupNearGhodbunderRoad = lazy(() => import("@/pages/local-playgroup").then(m => ({ default: m.PlaygroupNearGhodbunderRoad })));
const LazyPlaygroupInAnandNagar = lazy(() => import("@/pages/local-playgroup").then(m => ({ default: m.PlaygroupInAnandNagar })));
const LazyPlaygroupInKasarvadavali = lazy(() => import("@/pages/local-playgroup").then(m => ({ default: m.PlaygroupInKasarvadavali })));
const LazyPlaygroupInDhokali = lazy(() => import("@/pages/local-playgroup").then(m => ({ default: m.PlaygroupInDhokali })));

const LazyPreschoolInManpada = lazy(() => import("@/pages/preschool-location").then(m => ({ default: m.PreschoolInManpada })));
const LazyPreschoolInHariniwas = lazy(() => import("@/pages/preschool-location").then(m => ({ default: m.PreschoolInHariniwas })));
const LazyPreschoolInAnandNagar = lazy(() => import("@/pages/preschool-location").then(m => ({ default: m.PreschoolInAnandNagar })));
const LazyPreschoolInDhokali = lazy(() => import("@/pages/preschool-location").then(m => ({ default: m.PreschoolInDhokali })));
const LazyPreschoolInKalwa = lazy(() => import("@/pages/preschool-location").then(m => ({ default: m.PreschoolInKalwa })));
const LazyPreschoolInKasarvadavali = lazy(() => import("@/pages/preschool-location").then(m => ({ default: m.PreschoolInKasarvadavali })));

const LazyMotivationalThoughtsForKids = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.MotivationalThoughtsForKids })));
const LazyFruitsVegetablesEnglishHindi = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.FruitsVegetablesEnglishHindi })));
const LazyNationalSymbolsOfIndia = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.NationalSymbolsOfIndia })));
const LazySolitaryPlayActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.SolitaryPlayActivities })));
const LazyPreKgAgeGuide = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreKgAgeGuide })));
const LazySpringGardeningActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.SpringGardeningActivities })));
const LazyMotivateKidsForSchool = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.MotivateKidsForSchool })));
const LazyIndoorGamesForKids = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.IndoorGamesForKids })));
const LazyTeachingAidsHelp = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.TeachingAidsHelp })));
const LazySportsDayActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.SportsDayActivities })));
const LazyGoodTouchBadTouch = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.GoodTouchBadTouch })));
const LazyBodyPartsNames = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.BodyPartsNames })));
const LazyRainySeasonActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.RainySeasonActivities })));
const LazyListeningSkillsTips = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ListeningSkillsTips })));
const LazyDiwaliActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.DiwaliActivities })));
const LazyParentTeacherCommunication = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ParentTeacherCommunication })));
const LazyHoliActivities = lazy(() => import("@/pages/holi-activities"));
const LazyOvercomeFear = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.OvercomeFear })));
const LazyPlayEmotionalGrowth = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PlayEmotionalGrowth })));
const LazyForgetManners = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ForgetManners })));
const LazyTrendsEarlyChildhood = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.TrendsEarlyChildhood })));
const LazyHealthyPreschoolMeals = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.HealthyPreschoolMeals })));
const LazyEducationalToys = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.EducationalToys })));

// Homepage supporting posts

// About page supporting posts

// Programmes page supporting posts

// Playgroup page supporting posts

// Nursery page supporting posts

// Kindergarten page supporting posts

// Admissions page supporting posts

// Contact page supporting posts

// Centre-specific local SEO posts

// NEW SEO BLOG POSTS - BATCH 2

// Programmes page supporting posts (new)

// Playgroup page supporting posts (new)

// NEW SEO BLOG POSTS - BATCH 2 ADDITIONAL

const LazyAuthorArchivePage = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.AuthorArchivePage })));

const LazyTermsPage = lazy(() => import("@/pages/legal").then(m => ({ default: m.TermsPage })));
const LazyPrivacyPage = lazy(() => import("@/pages/legal").then(m => ({ default: m.PrivacyPage })));

import { legacySlugs } from "@shared/legacy-slugs";

const STANDALONE_LANDING_PATHS = [
  "/play-school-near-ghodbunder-road",
  "/play-school-near-majiwada",
  "/play-school-near-naupada",
  "/playgroup-in-manpada",
  "/playgroup-in-kalwa",
  "/playgroup-near-ghodbunder-road",
  "/playgroup-in-anand-nagar",
  "/playgroup-in-kasarvadavali",
  "/playgroup-in-dhokali",
  "/preschool-in-manpada-thane",
  "/preschool-in-hariniwas-thane",
  "/preschool-in-anand-nagar-thane",
  "/preschool-in-dhokali-thane",
  "/preschool-in-kalwa-thane",
  "/preschool-in-kasarvadavali-thane",
  "/ad",
  "/ad-google",
  "/flyer",
  "/RIS",
  "/ris-11th",
  ...legacySlugs.map(slug => slug.replace(/\/$/, '')),
  "/author/rainbowpreschools",
  "/author/rainbow-preschools",
];

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    if (!location.includes('#')) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    // Static LCP hero is only valid on the home page. On any SPA navigation
    // away from "/", remove it so it doesn't bleed through other routes.
    if (location !== "/") {
      const staticHero = document.getElementById("static-lcp-hero");
      if (staticHero) staticHero.remove();
    }
  }, [location]);
  
  return null;
}

function Router() {
  const [location] = useLocation();
  useAnalytics();
  useScrollRevealOnRoute(location);
  
  return (
    <Suspense fallback={<PageLoader />}>
      <ErrorBoundary name="router" key={location}>
        <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/programmes" component={Programmes} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/playgroup" component={PlaygroupLanding} />
        <Route path="/nursery" component={NurseryLanding} />
        <Route path="/kindergarten" component={KindergartenLanding} />
        <Route path="/happy-times" component={HappyTimesLanding} />
        <Route path="/contact" component={Contact} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        
        {/* Interactive tools & content pages */}
        <Route path="/preschool-readiness-quiz" component={ReadinessQuiz} />
        <Route path="/top-preschools-in-thane" component={TopPreschoolsThane} />
        <Route path="/testimonials" component={TestimonialsPage} />
        <Route path="/faqs" component={FAQsPage} />
        
        {/* High-intent SEO landing pages */}
        <Route path="/preschool-admissions" component={PreschoolAdmissions} />
        <Route path="/best-preschool-near-me-in-thane" component={BestPreschoolInThane} />
        <Route path="/play-school-near-me" component={PlaySchoolNearMe} />
        <Route path="/play-school-near-ghodbunder-road" component={PlaySchoolNearGhodbunderRoad} />
        <Route path="/play-school-near-majiwada" component={PlaySchoolNearMajiwada} />
        <Route path="/play-school-near-naupada" component={PlaySchoolNearNaupada} />
        
        <Route path="/ad" component={AdLanding} />
        <Route path="/ad-google" component={AdGoogleLanding} />
        <Route path="/flyer" component={FlyerLanding} />
        <Route path="/GSC" component={GscDashboardWithBoundary} />
        <Route path="/gsc" component={GscDashboardWithBoundary} />
        <Route path="/RIS" component={RISLanding} />
        <Route path="/ris" component={RISLanding} />
        <Route path="/ris-11th" component={RIS11thLanding} />
        
        <Route path="/playgroup-in-manpada" component={LazyPlaygroupInManpada} />
        <Route path="/playgroup-in-kalwa" component={LazyPlaygroupInKalwa} />
        <Route path="/playgroup-near-ghodbunder-road" component={LazyPlaygroupNearGhodbunderRoad} />
        <Route path="/playgroup-in-anand-nagar" component={LazyPlaygroupInAnandNagar} />
        <Route path="/playgroup-in-kasarvadavali" component={LazyPlaygroupInKasarvadavali} />
        <Route path="/playgroup-in-dhokali" component={LazyPlaygroupInDhokali} />
        
        <Route path="/preschool-in-manpada-thane" component={LazyPreschoolInManpada} />
        <Route path="/preschool-in-hariniwas-thane" component={LazyPreschoolInHariniwas} />
        <Route path="/preschool-in-anand-nagar-thane" component={LazyPreschoolInAnandNagar} />
        <Route path="/preschool-in-dhokali-thane" component={LazyPreschoolInDhokali} />
        <Route path="/preschool-in-kalwa-thane" component={LazyPreschoolInKalwa} />
        <Route path="/preschool-in-kasarvadavali-thane" component={LazyPreschoolInKasarvadavali} />
        
        <Route path="/36-motivational-thoughts-of-the-day-for-kids" component={LazyMotivationalThoughtsForKids} />
        <Route path="/explore-50-fruits-vegetables-english-hindi" component={LazyFruitsVegetablesEnglishHindi} />
        <Route path="/national-symbols-of-india-for-kids" component={LazyNationalSymbolsOfIndia} />
        <Route path="/solitary-play-activities" component={LazySolitaryPlayActivities} />
        <Route path="/pre-kg-age-guide" component={LazyPreKgAgeGuide} />
        <Route path="/10-spring-gardening-activitie-for-preschoolers" component={LazySpringGardeningActivities} />
        <Route path="/how-to-motivate-your-kids-for-school-8-ways" component={LazyMotivateKidsForSchool} />
        <Route path="/best-indoor-games-for-kids-at-home" component={LazyIndoorGamesForKids} />
        <Route path="/7-ways-teaching-aids-help-children-learn-better" component={LazyTeachingAidsHelp} />
        <Route path="/sports-day-activities-for-kindergarten" component={LazySportsDayActivities} />
        <Route path="/guide-to-understanding-good-touch-and-bad-touch" component={LazyGoodTouchBadTouch} />
        <Route path="/body-parts-names-in-english-for-preschoolers" component={LazyBodyPartsNames} />
        <Route path="/rainy-season-activities-for-kindergarten" component={LazyRainySeasonActivities} />
        <Route path="/6-simple-tips-for-improving-listening-skills-in-preschoolers" component={LazyListeningSkillsTips} />
        <Route path="/diwali-activity-for-kindergarten" component={LazyDiwaliActivities} />
        <Route path="/impact-of-parent-teacher-communication-on-student-success" component={LazyParentTeacherCommunication} />
        <Route path="/holi-activities-for-kids" component={LazyHoliActivities} />
        <Route path="/7-things-you-can-do-to-help-children-overcome-fear" component={LazyOvercomeFear} />
        <Route path="/importance-of-play-in-childrens-emotional-growth" component={LazyPlayEmotionalGrowth} />
        <Route path="/what-makes-children-forget-their-manners" component={LazyForgetManners} />
        <Route path="/trends-in-early-childhood-education" component={LazyTrendsEarlyChildhood} />
        <Route path="/healthy-preschool-meals-for-bright-minds-and-bodies" component={LazyHealthyPreschoolMeals} />
        <Route path="/boost-early-childhood-development-with-educational-toys" component={LazyEducationalToys} />
        
        
        {/* Homepage supporting blog posts */}
        
        {/* About page supporting blog posts */}
        
        {/* Programmes page supporting blog posts */}
        
        {/* Playgroup page supporting blog posts */}
        
        {/* Nursery page supporting blog posts */}
        
        {/* Kindergarten page supporting blog posts */}
        
        {/* Admissions page supporting blog posts */}
        
        {/* Contact page supporting blog posts */}
        
        {/* Centre-specific local SEO blog posts */}
        
        {/* NEW SEO BLOG POSTS - BATCH 2 */}
        {/* Homepage supporting posts (new) */}
        
        {/* About page supporting posts (new) */}
        
        {/* Programmes page supporting posts (new) */}
        
        {/* Playgroup page supporting posts (new) */}
        
        {/* NEW SEO BLOG POSTS - BATCH 2 ADDITIONAL */}
        {/* Homepage supporting */}
        
        {/* About page supporting */}
        
        {/* Programmes page supporting */}
        
        {/* Playgroup page supporting */}
        
        <Route path="/author/rainbowpreschools" component={LazyAuthorArchivePage} />
        
        <Route path="/terms" component={LazyTermsPage} />
        <Route path="/privacy" component={LazyPrivacyPage} />
        
        <Route component={NotFound} />
        </Switch>
      </ErrorBoundary>
    </Suspense>
  );
}

function DeferredChatWidget() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShow(true), 4000);
    return () => clearTimeout(id);
  }, []);
  if (!show) return null;
  return (
    <ErrorBoundary name="chat-widget" silent>
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </ErrorBoundary>
  );
}

function AppContent() {
  const [location] = useLocation();
  const pathWithoutQuery = location.split("?")[0];
  const normalizedPath = pathWithoutQuery.replace(/\/$/, '') || '/';
  const isStandaloneLanding = STANDALONE_LANDING_PATHS.some(p => p.toLowerCase() === normalizedPath.toLowerCase());

  if (isStandaloneLanding) {
    return (
      <>
        <ScrollToTop />
        <Router />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Navigation />
      <main className="flex-1">
        <ScrollToTop />
        <Router />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <DeferredChatWidget />
    </div>
  );
}

function DeferredSparkleTrail() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) return;
    const id = setTimeout(() => setShow(true), 6000);
    return () => clearTimeout(id);
  }, []);
  if (!show) return null;
  return (
    <ErrorBoundary name="sparkle-trail" silent>
      <Suspense fallback={null}>
        <RainbowSparkleTrail enabled={true} intensity={1} />
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  useEffect(() => {
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
    initGlobalFormTracking();
    setupLinkPrefetching();
    initPixelIfConsented();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="rainbow-preschool-theme">
        <TooltipProvider>
          <ErrorBoundary name="app-shell">
            <DeferredSparkleTrail />
            <AppContent />
            <CookieConsentBanner />
            <Toaster />
          </ErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
