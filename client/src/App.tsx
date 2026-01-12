import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
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
const AdGoogleLanding = lazy(() => import("@/pages/ad-google-landing"));

const RainbowSparkleTrail = lazy(() => import("@/components/rainbow-sparkle-trail").then(m => ({ default: m.RainbowSparkleTrail })));

const LazyPlaygroupInThane = lazy(() => import("@/pages/local-playgroup").then(m => ({ default: m.PlaygroupInThane })));
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
const LazyMidTermPlaygroupBenefits = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.MidTermPlaygroupBenefits })));
const LazyNationalSymbolsOfIndia = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.NationalSymbolsOfIndia })));
const LazySolitaryPlayActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.SolitaryPlayActivities })));
const LazyPreKgAgeGuide = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreKgAgeGuide })));
const LazySpringGardeningActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.SpringGardeningActivities })));
const LazyMotivateKidsForSchool = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.MotivateKidsForSchool })));
const LazyIndoorGamesForKids = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.IndoorGamesForKids })));
const LazyTeachingAidsHelp = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.TeachingAidsHelp })));
const LazyPreschoolVsPreKg = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreschoolVsPreKg })));
const LazyPreschoolAdmissionGuide = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreschoolAdmissionGuide })));
const LazySportsDayActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.SportsDayActivities })));
const LazyGoodTouchBadTouch = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.GoodTouchBadTouch })));
const LazyBodyPartsNames = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.BodyPartsNames })));
const LazyRainySeasonActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.RainySeasonActivities })));
const LazyListeningSkillsTips = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ListeningSkillsTips })));
const LazyDiwaliActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.DiwaliActivities })));
const LazyParentTeacherCommunication = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ParentTeacherCommunication })));
const LazyHoliActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.HoliActivities })));
const LazyOvercomeFear = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.OvercomeFear })));
const LazyPlayEmotionalGrowth = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PlayEmotionalGrowth })));
const LazyForgetManners = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ForgetManners })));
const LazyTrendsEarlyChildhood = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.TrendsEarlyChildhood })));
const LazyHealthyPreschoolMeals = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.HealthyPreschoolMeals })));
const LazyEducationalToys = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.EducationalToys })));
const LazyMidTermSocialDevelopment = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.MidTermSocialDevelopment })));
const LazyAdmissions2425 = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.Admissions2425 })));
const LazyInnovativeLearning = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.InnovativeLearning })));
const LazyMidTermPlaygroup = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.MidTermPlaygroup })));
const LazyBrainGymActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.BrainGymActivities })));
const LazyImmunityBoostingFoods = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ImmunityBoostingFoods })));
const LazyColorsAndShapes = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ColorsAndShapes })));
const LazyCookingForKids = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.CookingForKids })));
const LazyParentsGuideMidTerm = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ParentsGuideMidTerm })));
const LazyLearnWritingTips = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.LearnWritingTips })));
const LazyEvenOddNumbers = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.EvenOddNumbers })));
const LazyPreschoolTourQuestions = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreschoolTourQuestions })));
const LazyChoosingPreschoolQuestions = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ChoosingPreschoolQuestions })));
const LazyInteractiveLearning = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.InteractiveLearning })));
const LazySummerActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.SummerActivities })));
const LazyCleanestSchoolAward = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.CleanestSchoolAward })));
const LazyPreschoolDevelopment = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreschoolDevelopment })));
const LazyMidTermPlaygroupAdmission = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.MidTermPlaygroupAdmission })));
const LazyNurseryImportance = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.NurseryImportance })));
const LazyPromisingPreschoolAward = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PromisingPreschoolAward })));
const LazyLifeLessonsConfidence = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.LifeLessonsConfidence })));
const LazyGamesMakeKidsSmarter = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.GamesMakeKidsSmarter })));
const LazyPhysicalDevelopmentSigns = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PhysicalDevelopmentSigns })));
const LazyMidTermVisitQuestions = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.MidTermVisitQuestions })));
const LazyFAQsPage = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.FAQsPage })));
const LazyUnderstandingPreschoolImportance = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.UnderstandingPreschoolImportance })));
const LazyBestPreschoolCurriculumThane = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.BestPreschoolCurriculumThane })));
const LazyHowToChooseBestPreschool = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.HowToChooseBestPreschool })));
const LazyPlaygroupAdmissionGuide = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PlaygroupAdmissionGuide })));
const LazyAuthorArchivePage = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.AuthorArchivePage })));

const LazyTermsPage = lazy(() => import("@/pages/legal").then(m => ({ default: m.TermsPage })));
const LazyPrivacyPage = lazy(() => import("@/pages/legal").then(m => ({ default: m.PrivacyPage })));

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
  "/ad-google",
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
        <Route path="/ad-google" component={AdGoogleLanding} />
        
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
        
        <Route path="/best-preschool-curriculum-thane" component={LazyBestPreschoolCurriculumThane} />
        <Route path="/how-to-choose-best-preschool-thane" component={LazyHowToChooseBestPreschool} />
        <Route path="/playgroup-admission-thane-complete-guide" component={LazyPlaygroupAdmissionGuide} />
        
        <Route path="/author/rainbowpreschools" component={LazyAuthorArchivePage} />
        <Route path="/author/rainbow-preschools" component={LazyAuthorArchivePage} />
        
        <Route path="/terms" component={LazyTermsPage} />
        <Route path="/privacy" component={LazyPrivacyPage} />
        
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
