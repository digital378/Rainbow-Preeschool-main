import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { RainbowSparkleTrail } from "@/components/rainbow-sparkle-trail";
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
import AdLanding from "@/pages/ad-landing";

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

// Legacy Blog Pages (SEO Recovery)
import {
  MotivationalThoughtsForKids,
  FruitsVegetablesEnglishHindi,
  MidTermPlaygroupBenefits,
  NationalSymbolsOfIndia,
  SolitaryPlayActivities,
  PreKgAgeGuide,
  SpringGardeningActivities,
  MotivateKidsForSchool,
  IndoorGamesForKids,
  TeachingAidsHelp,
  PreschoolVsPreKg,
  PreschoolAdmissionGuide,
  SportsDayActivities,
  GoodTouchBadTouch,
  BodyPartsNames,
  RainySeasonActivities,
  ListeningSkillsTips,
  DiwaliActivities,
  ParentTeacherCommunication,
  HoliActivities,
  OvercomeFear,
  PlayEmotionalGrowth,
  ForgetManners,
  TrendsEarlyChildhood,
  HealthyPreschoolMeals,
  EducationalToys,
  MidTermSocialDevelopment,
  Admissions2425,
  InnovativeLearning,
  MidTermPlaygroup,
  BrainGymActivities,
  ImmunityBoostingFoods,
  ColorsAndShapes,
  CookingForKids,
  ParentsGuideMidTerm,
  LearnWritingTips,
  EvenOddNumbers,
  PreschoolTourQuestions,
  ChoosingPreschoolQuestions,
  InteractiveLearning,
  SummerActivities,
  CleanestSchoolAward,
  PreschoolDevelopment,
  MidTermPlaygroupAdmission,
  NurseryImportance,
  PromisingPreschoolAward,
  LifeLessonsConfidence,
  GamesMakeKidsSmarter,
  PhysicalDevelopmentSigns,
  MidTermVisitQuestions,
  FAQsPage,
  UnderstandingPreschoolImportance,
  AuthorArchivePage,
  legacySlugs,
} from "@/pages/legacy-pages";

// Standalone landing page paths (no nav/footer) - includes legacy pages which have their own nav/footer
const STANDALONE_LANDING_PATHS = [
  "/playgroup-in-thane",
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
  ...legacySlugs.map(slug => slug.replace(/\/$/, '')),
  "/author/rainbowpreschools",
  "/author/rainbow-preschools",
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
      
      {/* Ad Landing Page (Standalone - noindex, no nav/footer) */}
      <Route path="/ad" component={AdLanding} />
      
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
      
      {/* Legacy Blog Pages (SEO Recovery) */}
      <Route path="/36-motivational-thoughts-of-the-day-for-kids" component={MotivationalThoughtsForKids} />
      <Route path="/explore-50-fruits-vegetables-english-hindi" component={FruitsVegetablesEnglishHindi} />
      <Route path="/mid-term-playgroup-admissions-benefits" component={MidTermPlaygroupBenefits} />
      <Route path="/national-symbols-of-india-for-kids" component={NationalSymbolsOfIndia} />
      <Route path="/solitary-play-activities" component={SolitaryPlayActivities} />
      <Route path="/pre-kg-age-guide" component={PreKgAgeGuide} />
      <Route path="/10-spring-gardening-activitie-for-preschoolers" component={SpringGardeningActivities} />
      <Route path="/how-to-motivate-your-kids-for-school-8-ways" component={MotivateKidsForSchool} />
      <Route path="/best-indoor-games-for-kids-at-home" component={IndoorGamesForKids} />
      <Route path="/7-ways-teaching-aids-help-children-learn-better" component={TeachingAidsHelp} />
      <Route path="/preschool-vs-prekg-2" component={PreschoolVsPreKg} />
      <Route path="/preschool-admission-process-guide" component={PreschoolAdmissionGuide} />
      <Route path="/sports-day-activities-for-kindergarten" component={SportsDayActivities} />
      <Route path="/guide-to-understanding-good-touch-and-bad-touch" component={GoodTouchBadTouch} />
      <Route path="/body-parts-names-in-english-for-preschoolers" component={BodyPartsNames} />
      <Route path="/rainy-season-activities-for-kindergarten" component={RainySeasonActivities} />
      <Route path="/6-simple-tips-for-improving-listening-skills-in-preschoolers" component={ListeningSkillsTips} />
      <Route path="/diwali-activity-for-kindergarten" component={DiwaliActivities} />
      <Route path="/impact-of-parent-teacher-communication-on-student-success" component={ParentTeacherCommunication} />
      <Route path="/holi-activities-for-kids" component={HoliActivities} />
      <Route path="/7-things-you-can-do-to-help-children-overcome-fear" component={OvercomeFear} />
      <Route path="/importance-of-play-in-childrens-emotional-growth" component={PlayEmotionalGrowth} />
      <Route path="/what-makes-children-forget-their-manners" component={ForgetManners} />
      <Route path="/trends-in-early-childhood-education" component={TrendsEarlyChildhood} />
      <Route path="/healthy-preschool-meals-for-bright-minds-and-bodies" component={HealthyPreschoolMeals} />
      <Route path="/boost-early-childhood-development-with-educational-toys" component={EducationalToys} />
      <Route path="/how-mid-term-admission-open-for-playgroup-supports-social-and-emotional-development" component={MidTermSocialDevelopment} />
      <Route path="/admissions-24-25" component={Admissions2425} />
      <Route path="/innovative-learning-activities-for-preschoolers" component={InnovativeLearning} />
      <Route path="/mid-term-playgroup" component={MidTermPlaygroup} />
      <Route path="/brain-gym-activities-for-preschoolers" component={BrainGymActivities} />
      <Route path="/immunity-boosting-foods-for-kids" component={ImmunityBoostingFoods} />
      <Route path="/10-easy-ways-to-help-kids-learn-colours-and-shapes-better" component={ColorsAndShapes} />
      <Route path="/8-amazing-reasons-why-cooking-is-important-for-kids" component={CookingForKids} />
      <Route path="/parents-guide-mid-term-playgroup-admission" component={ParentsGuideMidTerm} />
      <Route path="/6-quick-tips-to-help-children-learn-writing" component={LearnWritingTips} />
      <Route path="/fun-games-teach-even-odd-numbers" component={EvenOddNumbers} />
      <Route path="/what-to-ask-during-a-tour-of-a-preschool-in-thane" component={PreschoolTourQuestions} />
      <Route path="/9-questions-to-ask-while-choosing-a-pre-school" component={ChoosingPreschoolQuestions} />
      <Route path="/fun-interactive-learning-activities-for-preschoolers-2" component={InteractiveLearning} />
      <Route path="/innovative-summer-activities-for-kids-keeping-minds-engaged" component={SummerActivities} />
      <Route path="/rainbow-family-wins-cleanest-school-thane" component={CleanestSchoolAward} />
      <Route path="/why-preschool-education-shapes-early-childhood-development" component={PreschoolDevelopment} />
      <Route path="/mid-term-playgroup-admission" component={MidTermPlaygroupAdmission} />
      <Route path="/why-nursery-school-is-important-for-early-childhood-development" component={NurseryImportance} />
      <Route path="/the-most-promising-preschool-chain-of-the-year-maharashtra" component={PromisingPreschoolAward} />
      <Route path="/51-inspiring-life-lessons-that-make-children-confident" component={LifeLessonsConfidence} />
      <Route path="/play-these-9-games-to-make-kids-smarter" component={GamesMakeKidsSmarter} />
      <Route path="/45-signs-of-healthy-physical-development-ages-3-6" component={PhysicalDevelopmentSigns} />
      <Route path="/questions-ask-school-visit-mid-term-playgroup-admissions" component={MidTermVisitQuestions} />
      <Route path="/faqs" component={FAQsPage} />
      <Route path="/understanding-the-importance-of-preschool-in-early-childhood-development" component={UnderstandingPreschoolImportance} />
      
      {/* Author Archive Pages (redirect to resources) */}
      <Route path="/author/rainbowpreschools" component={AuthorArchivePage} />
      <Route path="/author/rainbow-preschools" component={AuthorArchivePage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  // Normalize path by removing query parameters and trailing slashes for standalone check
  const pathWithoutQuery = location.split("?")[0];
  const normalizedPath = pathWithoutQuery.replace(/\/$/, '') || '/';
  const isStandaloneLanding = STANDALONE_LANDING_PATHS.includes(normalizedPath);

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
          <RainbowSparkleTrail enabled={true} intensity={1} />
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
