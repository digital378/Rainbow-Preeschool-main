import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense, ComponentType } from "react";
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

const About = lazy(() => import("@/pages/about"));
const Programmes = lazy(() => import("@/pages/programmes"));
const PlaygroupLanding = lazy(() => import("@/pages/playgroup-landing"));
const NurseryLanding = lazy(() => import("@/pages/nursery-landing"));
const KindergartenLanding = lazy(() => import("@/pages/kindergarten-landing"));
const KidsActivityClubLanding = lazy(() => import("@/pages/kids-activity-club-landing"));
const SummerCampLanding = lazy(() => import("@/pages/summer-camp-landing"));
const HappyTimesLanding = lazy(() => import("@/pages/happy-times-landing"));
const Contact = lazy(() => import("@/pages/contact"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AdLanding = lazy(() => import("@/pages/ad-landing"));

const RainbowSparkleTrail = lazy(() => import("@/components/rainbow-sparkle-trail").then(m => ({ default: m.RainbowSparkleTrail })));

let cachedLocalPlaygroupModule: Promise<typeof import("@/pages/local-playgroup")> | null = null;
let cachedPreschoolLocationModule: Promise<typeof import("@/pages/preschool-location")> | null = null;
let cachedLegacyPagesModule: Promise<typeof import("@/pages/legacy-pages")> | null = null;

function getLocalPlaygroupModule() {
  if (!cachedLocalPlaygroupModule) {
    cachedLocalPlaygroupModule = import("@/pages/local-playgroup");
  }
  return cachedLocalPlaygroupModule;
}

function getPreschoolLocationModule() {
  if (!cachedPreschoolLocationModule) {
    cachedPreschoolLocationModule = import("@/pages/preschool-location");
  }
  return cachedPreschoolLocationModule;
}

function getLegacyPagesModule() {
  if (!cachedLegacyPagesModule) {
    cachedLegacyPagesModule = import("@/pages/legacy-pages");
  }
  return cachedLegacyPagesModule;
}

function createLazyComponent<T extends Record<string, ComponentType<unknown>>>(
  getModule: () => Promise<T>,
  exportName: keyof T
) {
  return lazy(async () => {
    const mod = await getModule();
    return { default: mod[exportName] as ComponentType<unknown> };
  });
}

const LazyPlaygroupInThane = createLazyComponent(getLocalPlaygroupModule, 'PlaygroupInThane');
const LazyPlaygroupInManpada = createLazyComponent(getLocalPlaygroupModule, 'PlaygroupInManpada');
const LazyPlaygroupInKalwa = createLazyComponent(getLocalPlaygroupModule, 'PlaygroupInKalwa');
const LazyPlaygroupNearGhodbunderRoad = createLazyComponent(getLocalPlaygroupModule, 'PlaygroupNearGhodbunderRoad');
const LazyPlaygroupInAnandNagar = createLazyComponent(getLocalPlaygroupModule, 'PlaygroupInAnandNagar');
const LazyPlaygroupInKasarvadavali = createLazyComponent(getLocalPlaygroupModule, 'PlaygroupInKasarvadavali');
const LazyPlaygroupInDhokali = createLazyComponent(getLocalPlaygroupModule, 'PlaygroupInDhokali');

const LazyPreschoolInManpada = createLazyComponent(getPreschoolLocationModule, 'PreschoolInManpada');
const LazyPreschoolInHariniwas = createLazyComponent(getPreschoolLocationModule, 'PreschoolInHariniwas');
const LazyPreschoolInAnandNagar = createLazyComponent(getPreschoolLocationModule, 'PreschoolInAnandNagar');
const LazyPreschoolInDhokali = createLazyComponent(getPreschoolLocationModule, 'PreschoolInDhokali');
const LazyPreschoolInKalwa = createLazyComponent(getPreschoolLocationModule, 'PreschoolInKalwa');
const LazyPreschoolInKasarvadavali = createLazyComponent(getPreschoolLocationModule, 'PreschoolInKasarvadavali');

const LazyMotivationalThoughtsForKids = createLazyComponent(getLegacyPagesModule, 'MotivationalThoughtsForKids');
const LazyFruitsVegetablesEnglishHindi = createLazyComponent(getLegacyPagesModule, 'FruitsVegetablesEnglishHindi');
const LazyMidTermPlaygroupBenefits = createLazyComponent(getLegacyPagesModule, 'MidTermPlaygroupBenefits');
const LazyNationalSymbolsOfIndia = createLazyComponent(getLegacyPagesModule, 'NationalSymbolsOfIndia');
const LazySolitaryPlayActivities = createLazyComponent(getLegacyPagesModule, 'SolitaryPlayActivities');
const LazyPreKgAgeGuide = createLazyComponent(getLegacyPagesModule, 'PreKgAgeGuide');
const LazySpringGardeningActivities = createLazyComponent(getLegacyPagesModule, 'SpringGardeningActivities');
const LazyMotivateKidsForSchool = createLazyComponent(getLegacyPagesModule, 'MotivateKidsForSchool');
const LazyIndoorGamesForKids = createLazyComponent(getLegacyPagesModule, 'IndoorGamesForKids');
const LazyTeachingAidsHelp = createLazyComponent(getLegacyPagesModule, 'TeachingAidsHelp');
const LazyPreschoolVsPreKg = createLazyComponent(getLegacyPagesModule, 'PreschoolVsPreKg');
const LazyPreschoolAdmissionGuide = createLazyComponent(getLegacyPagesModule, 'PreschoolAdmissionGuide');
const LazySportsDayActivities = createLazyComponent(getLegacyPagesModule, 'SportsDayActivities');
const LazyGoodTouchBadTouch = createLazyComponent(getLegacyPagesModule, 'GoodTouchBadTouch');
const LazyBodyPartsNames = createLazyComponent(getLegacyPagesModule, 'BodyPartsNames');
const LazyRainySeasonActivities = createLazyComponent(getLegacyPagesModule, 'RainySeasonActivities');
const LazyListeningSkillsTips = createLazyComponent(getLegacyPagesModule, 'ListeningSkillsTips');
const LazyDiwaliActivities = createLazyComponent(getLegacyPagesModule, 'DiwaliActivities');
const LazyParentTeacherCommunication = createLazyComponent(getLegacyPagesModule, 'ParentTeacherCommunication');
const LazyHoliActivities = createLazyComponent(getLegacyPagesModule, 'HoliActivities');
const LazyOvercomeFear = createLazyComponent(getLegacyPagesModule, 'OvercomeFear');
const LazyPlayEmotionalGrowth = createLazyComponent(getLegacyPagesModule, 'PlayEmotionalGrowth');
const LazyForgetManners = createLazyComponent(getLegacyPagesModule, 'ForgetManners');
const LazyTrendsEarlyChildhood = createLazyComponent(getLegacyPagesModule, 'TrendsEarlyChildhood');
const LazyHealthyPreschoolMeals = createLazyComponent(getLegacyPagesModule, 'HealthyPreschoolMeals');
const LazyEducationalToys = createLazyComponent(getLegacyPagesModule, 'EducationalToys');
const LazyMidTermSocialDevelopment = createLazyComponent(getLegacyPagesModule, 'MidTermSocialDevelopment');
const LazyAdmissions2425 = createLazyComponent(getLegacyPagesModule, 'Admissions2425');
const LazyInnovativeLearning = createLazyComponent(getLegacyPagesModule, 'InnovativeLearning');
const LazyMidTermPlaygroup = createLazyComponent(getLegacyPagesModule, 'MidTermPlaygroup');
const LazyBrainGymActivities = createLazyComponent(getLegacyPagesModule, 'BrainGymActivities');
const LazyImmunityBoostingFoods = createLazyComponent(getLegacyPagesModule, 'ImmunityBoostingFoods');
const LazyColorsAndShapes = createLazyComponent(getLegacyPagesModule, 'ColorsAndShapes');
const LazyCookingForKids = createLazyComponent(getLegacyPagesModule, 'CookingForKids');
const LazyParentsGuideMidTerm = createLazyComponent(getLegacyPagesModule, 'ParentsGuideMidTerm');
const LazyLearnWritingTips = createLazyComponent(getLegacyPagesModule, 'LearnWritingTips');
const LazyEvenOddNumbers = createLazyComponent(getLegacyPagesModule, 'EvenOddNumbers');
const LazyPreschoolTourQuestions = createLazyComponent(getLegacyPagesModule, 'PreschoolTourQuestions');
const LazyChoosingPreschoolQuestions = createLazyComponent(getLegacyPagesModule, 'ChoosingPreschoolQuestions');
const LazyInteractiveLearning = createLazyComponent(getLegacyPagesModule, 'InteractiveLearning');
const LazySummerActivities = createLazyComponent(getLegacyPagesModule, 'SummerActivities');
const LazyCleanestSchoolAward = createLazyComponent(getLegacyPagesModule, 'CleanestSchoolAward');
const LazyPreschoolDevelopment = createLazyComponent(getLegacyPagesModule, 'PreschoolDevelopment');
const LazyMidTermPlaygroupAdmission = createLazyComponent(getLegacyPagesModule, 'MidTermPlaygroupAdmission');
const LazyNurseryImportance = createLazyComponent(getLegacyPagesModule, 'NurseryImportance');
const LazyPromisingPreschoolAward = createLazyComponent(getLegacyPagesModule, 'PromisingPreschoolAward');
const LazyLifeLessonsConfidence = createLazyComponent(getLegacyPagesModule, 'LifeLessonsConfidence');
const LazyGamesMakeKidsSmarter = createLazyComponent(getLegacyPagesModule, 'GamesMakeKidsSmarter');
const LazyPhysicalDevelopmentSigns = createLazyComponent(getLegacyPagesModule, 'PhysicalDevelopmentSigns');
const LazyMidTermVisitQuestions = createLazyComponent(getLegacyPagesModule, 'MidTermVisitQuestions');
const LazyFAQsPage = createLazyComponent(getLegacyPagesModule, 'FAQsPage');
const LazyUnderstandingPreschoolImportance = createLazyComponent(getLegacyPagesModule, 'UnderstandingPreschoolImportance');
const LazyAuthorArchivePage = createLazyComponent(getLegacyPagesModule, 'AuthorArchivePage');

import { legacySlugs } from "@/pages/legacy-pages";

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
  }, [location]);
  
  return null;
}

function Router() {
  const [location] = useLocation();
  useAnalytics();
  useScrollRevealOnRoute(location);
  
  return (
    <Suspense fallback={<PageLoader />}>
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
        
        <Route path="/ad" component={AdLanding} />
        
        <Route path="/playgroup-in-thane" component={LazyPlaygroupInThane} />
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
        <Route path="/mid-term-playgroup-admissions-benefits" component={LazyMidTermPlaygroupBenefits} />
        <Route path="/national-symbols-of-india-for-kids" component={LazyNationalSymbolsOfIndia} />
        <Route path="/solitary-play-activities" component={LazySolitaryPlayActivities} />
        <Route path="/pre-kg-age-guide" component={LazyPreKgAgeGuide} />
        <Route path="/10-spring-gardening-activitie-for-preschoolers" component={LazySpringGardeningActivities} />
        <Route path="/how-to-motivate-your-kids-for-school-8-ways" component={LazyMotivateKidsForSchool} />
        <Route path="/best-indoor-games-for-kids-at-home" component={LazyIndoorGamesForKids} />
        <Route path="/7-ways-teaching-aids-help-children-learn-better" component={LazyTeachingAidsHelp} />
        <Route path="/preschool-vs-prekg-2" component={LazyPreschoolVsPreKg} />
        <Route path="/preschool-admission-process-guide" component={LazyPreschoolAdmissionGuide} />
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
        <Route path="/how-mid-term-admission-open-for-playgroup-supports-social-and-emotional-development" component={LazyMidTermSocialDevelopment} />
        <Route path="/admissions-24-25" component={LazyAdmissions2425} />
        <Route path="/innovative-learning-activities-for-preschoolers" component={LazyInnovativeLearning} />
        <Route path="/mid-term-playgroup" component={LazyMidTermPlaygroup} />
        <Route path="/brain-gym-activities-for-preschoolers" component={LazyBrainGymActivities} />
        <Route path="/immunity-boosting-foods-for-kids" component={LazyImmunityBoostingFoods} />
        <Route path="/10-easy-ways-to-help-kids-learn-colours-and-shapes-better" component={LazyColorsAndShapes} />
        <Route path="/8-amazing-reasons-why-cooking-is-important-for-kids" component={LazyCookingForKids} />
        <Route path="/parents-guide-mid-term-playgroup-admission" component={LazyParentsGuideMidTerm} />
        <Route path="/6-quick-tips-to-help-children-learn-writing" component={LazyLearnWritingTips} />
        <Route path="/fun-games-teach-even-odd-numbers" component={LazyEvenOddNumbers} />
        <Route path="/what-to-ask-during-a-tour-of-a-preschool-in-thane" component={LazyPreschoolTourQuestions} />
        <Route path="/9-questions-to-ask-while-choosing-a-pre-school" component={LazyChoosingPreschoolQuestions} />
        <Route path="/fun-interactive-learning-activities-for-preschoolers-2" component={LazyInteractiveLearning} />
        <Route path="/innovative-summer-activities-for-kids-keeping-minds-engaged" component={LazySummerActivities} />
        <Route path="/rainbow-family-wins-cleanest-school-thane" component={LazyCleanestSchoolAward} />
        <Route path="/why-preschool-education-shapes-early-childhood-development" component={LazyPreschoolDevelopment} />
        <Route path="/mid-term-playgroup-admission" component={LazyMidTermPlaygroupAdmission} />
        <Route path="/why-nursery-school-is-important-for-early-childhood-development" component={LazyNurseryImportance} />
        <Route path="/the-most-promising-preschool-chain-of-the-year-maharashtra" component={LazyPromisingPreschoolAward} />
        <Route path="/51-inspiring-life-lessons-that-make-children-confident" component={LazyLifeLessonsConfidence} />
        <Route path="/play-these-9-games-to-make-kids-smarter" component={LazyGamesMakeKidsSmarter} />
        <Route path="/45-signs-of-healthy-physical-development-ages-3-6" component={LazyPhysicalDevelopmentSigns} />
        <Route path="/questions-ask-school-visit-mid-term-playgroup-admissions" component={LazyMidTermVisitQuestions} />
        <Route path="/faqs" component={LazyFAQsPage} />
        <Route path="/understanding-the-importance-of-preschool-in-early-childhood-development" component={LazyUnderstandingPreschoolImportance} />
        
        <Route path="/author/rainbowpreschools" component={LazyAuthorArchivePage} />
        <Route path="/author/rainbow-preschools" component={LazyAuthorArchivePage} />
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function AppContent() {
  const [location] = useLocation();
  const pathWithoutQuery = location.split("?")[0];
  const normalizedPath = pathWithoutQuery.replace(/\/$/, '') || '/';
  const isStandaloneLanding = STANDALONE_LANDING_PATHS.includes(normalizedPath);

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
    initGlobalFormTracking();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="rainbow-preschool-theme">
        <TooltipProvider>
          <Suspense fallback={null}>
            <RainbowSparkleTrail enabled={true} intensity={1} />
          </Suspense>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
