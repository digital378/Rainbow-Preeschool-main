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
const FlyerLanding = lazy(() => import("@/pages/flyer-landing"));
const RISLanding = lazy(() => import("@/pages/ris-landing"));

// High-intent SEO landing pages
const PreschoolAdmissions = lazy(() => import("@/pages/preschool-admissions"));
const PreschoolNearMe = lazy(() => import("@/pages/preschool-near-me"));
const BestPreschoolInThane = lazy(() => import("@/pages/best-preschool-in-thane"));

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

// Homepage supporting posts
const LazyRainbowPreschoolCentresThane = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.RainbowPreschoolCentresThane })));
const LazyComparingPreschoolsThane = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ComparingPreschoolsThane })));
const LazyQualityPreschoolIndicators = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.QualityPreschoolIndicators })));
const LazyPreschoolVsDaycare = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreschoolVsDaycare })));
const LazyEarlyChildhoodEducationImportance = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.EarlyChildhoodEducationImportance })));

// About page supporting posts
const LazyRainbowPreschoolJourneySince2007 = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.RainbowPreschoolJourneySince2007 })));
const LazyRainbowPreschoolAwards = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.RainbowPreschoolAwards })));
const LazyTeacherTrainingQuality = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.TeacherTrainingQuality })));
const LazyParentTestimonialsExperiences = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ParentTestimonialsExperiences })));
const LazyChildSafetyPreschool = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ChildSafetyPreschool })));

// Programmes page supporting posts
const LazyPlayBasedLearningBenefits = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PlayBasedLearningBenefits })));
const LazyNEP2020EarlyChildhoodGuide = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.NEP2020EarlyChildhoodGuide })));
const LazyHolisticChildDevelopment = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.HolisticChildDevelopment })));
const LazyPreschoolLearningOutcomes = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreschoolLearningOutcomes })));

// Playgroup page supporting posts
const LazyBenefitsPlaygroupToddlers = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.BenefitsPlaygroupToddlers })));
const LazyPlaygroupVsStayingHome = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PlaygroupVsStayingHome })));
const LazySeparationAnxietyPlaygroup = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.SeparationAnxietyPlaygroup })));
const LazyPlaygroupActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PlaygroupActivities })));
const LazyRightAgeStartPlaygroup = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.RightAgeStartPlaygroup })));

// Nursery page supporting posts
const LazyNurserySchoolBenefits = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.NurserySchoolBenefits })));
const LazyNurseryVsPlaygroup = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.NurseryVsPlaygroup })));
const LazyNurseryCurriculum = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.NurseryCurriculum })));
const LazyPreparingChildNursery = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreparingChildNursery })));
const LazyNurseryAdmissionAge = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.NurseryAdmissionAge })));

// Kindergarten page supporting posts
const LazyKindergartenReadiness = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.KindergartenReadiness })));
const LazyJrKgSrKgDifference = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.JrKgSrKgDifference })));
const LazyKindergartenCurriculumPreparation = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.KindergartenCurriculumPreparation })));
const LazyChoosingRightKindergarten = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ChoosingRightKindergarten })));
const LazyKindergartenAdmissionThane = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.KindergartenAdmissionThane })));

// Admissions page supporting posts
const LazyPreschoolAdmissionProcess = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreschoolAdmissionProcess })));
const LazyPreschoolAdmissionDocuments = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreschoolAdmissionDocuments })));
const LazyWhenApplyPreschoolTimeline = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.WhenApplyPreschoolTimeline })));
const LazyQuestionsAskPreschoolVisit = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.QuestionsAskPreschoolVisit })));
const LazyPreschoolFeesThane = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreschoolFeesThane })));

// Contact page supporting posts
const LazyVisitingPreschoolGuide = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.VisitingPreschoolGuide })));
const LazyHowReachRainbowPreschool = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.HowReachRainbowPreschool })));

// Centre-specific local SEO posts
const LazyEarlyChildhoodManpadaGB = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.EarlyChildhoodManpadaGB })));
const LazyChildDevelopmentHariniwas = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ChildDevelopmentHariniwas })));
const LazyBestPlayschoolAnandNagar = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.BestPlayschoolAnandNagar })));
const LazyPreschoolOptionsDhokali = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreschoolOptionsDhokali })));
const LazyTrustedPreschoolKalwa = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.TrustedPreschoolKalwa })));
const LazyQualityPreschoolKasarvadavali = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.QualityPreschoolKasarvadavali })));
const LazyToddlerActivitiesManpada = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ToddlerActivitiesManpada })));
const LazySchoolReadinessHariniwas = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.SchoolReadinessHariniwas })));
const LazyNurseryAdmissionsAnandNagar = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.NurseryAdmissionsAnandNagar })));
const LazyPlaygroupEnrollmentDhokali = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PlaygroupEnrollmentDhokali })));
const LazyKindergartenProgramsKalwa = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.KindergartenProgramsKalwa })));
const LazyBestNurseryKasarvadavali = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.BestNurseryKasarvadavali })));

// NEW SEO BLOG POSTS - BATCH 2
const LazyBestEarlyLearningCentresThane = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.BestEarlyLearningCentresThane })));
const LazyMontessoriVsPlayBased = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.MontessoriVsPlayBased })));
const LazyFranchiseVsStandalone = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.FranchiseVsStandalone })));
const LazyWorkingParentsGuide = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.WorkingParentsGuide })));
const LazyAffordableQualityPreschools = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.AffordableQualityPreschools })));
const LazyRainbowTeachingMethodology = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.RainbowTeachingMethodology })));
const LazyRainbowInfrastructureFacilities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.RainbowInfrastructureFacilities })));
const LazyPreschoolAccreditationImportance = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreschoolAccreditationImportance })));
const LazyRainbowCommunityInitiatives = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.RainbowCommunityInitiatives })));
const LazyExperiencedTeachersImportance = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ExperiencedTeachersImportance })));

// Programmes page supporting posts (new)
const LazyEarlyChildhoodCurriculumExplained = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.EarlyChildhoodCurriculumExplained })));
const LazyActivityBasedLearningBenefits = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ActivityBasedLearningBenefits })));
const LazyCreativeArtsPreschool = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.CreativeArtsPreschool })));
const LazyPhysicalDevelopmentPreschool = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PhysicalDevelopmentPreschool })));
const LazyLanguageDevelopmentPreschool = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.LanguageDevelopmentPreschool })));

// Playgroup page supporting posts (new)
const LazyToddlerSeparationAnxiety = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ToddlerSeparationAnxiety })));
const LazyToddlerSocialSkills = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ToddlerSocialSkills })));
const LazyPlaygroupDailySchedule = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PlaygroupDailySchedule })));
const LazyToddlerReadyForPlaygroup = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ToddlerReadyForPlaygroup })));
const LazyBenefitsEarlyPlaygroup = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.BenefitsEarlyPlaygroup })));

// NEW SEO BLOG POSTS - BATCH 2 ADDITIONAL
const LazyWhyEarlyChildhoodEducation = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.WhyEarlyChildhoodEducation })));
const LazyChoosingBestPreschool = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ChoosingBestPreschool })));
const LazyHolisticChildDevelopmentApproach = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.HolisticChildDevelopmentRainbow })));
const LazyPreschoolVsDaycareDifference = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreschoolVsDaycareDifference })));
const LazyPreparingChildForPreschool = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PreparingChildForPreschool })));
const LazyRainbowTeachingPhilosophy = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.RainbowTeachingPhilosophy })));
const LazyHistoryEarlyChildhoodThane = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.HistoryEarlyChildhoodThane })));
const LazyQualityPreschoolTeacher = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.QualityPreschoolTeacher })));
const LazyParentTeacherPartnership = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.ParentTeacherPartnership })));
const LazyRainbowAwardsRecognition = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.RainbowAwardsRecognition })));
const LazyAgeAppropriateLearning = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.AgeAppropriateLearning })));
const LazyPlayBasedVsAcademic = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PlayBasedVsAcademic })));
const LazyRainbowCurriculumSchoolReadiness = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.RainbowCurriculumSchoolReadiness })));
const LazyCreativeArtsEarlyChildhood = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.CreativeArtsEarlyChildhood })));
const LazyPhysicalDevelopmentActivities = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.PhysicalDevelopmentActivities })));
const LazySeparationAnxietyTips = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.SeparationAnxietyTips })));
const LazySocialisationBenefitsToddlers = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.SocialisationBenefitsToddlers })));

const LazyAuthorArchivePage = lazy(() => import("@/pages/legacy-pages").then(m => ({ default: m.AuthorArchivePage })));

const LazyTermsPage = lazy(() => import("@/pages/legal").then(m => ({ default: m.TermsPage })));
const LazyPrivacyPage = lazy(() => import("@/pages/legal").then(m => ({ default: m.PrivacyPage })));
const RepublicDay2026 = lazy(() => import("@/pages/republic-day-2026"));

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
  "/flyer",
  "/RIS",
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
        
        {/* High-intent SEO landing pages */}
        <Route path="/preschool-admissions" component={PreschoolAdmissions} />
        <Route path="/preschool-near-me" component={PreschoolNearMe} />
        <Route path="/best-preschool-in-thane" component={BestPreschoolInThane} />
        
        <Route path="/ad" component={AdLanding} />
        <Route path="/ad-google" component={AdGoogleLanding} />
        <Route path="/flyer" component={FlyerLanding} />
        <Route path="/RIS" component={RISLanding} />
        <Route path="/republic-day-2026" component={RepublicDay2026} />
        
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
        
        {/* Homepage supporting blog posts */}
        <Route path="/why-rainbow-preschool-best-thane-2026" component={LazyRainbowPreschoolCentresThane} />
        <Route path="/rainbow-preschool-centres-thane" component={LazyRainbowPreschoolCentresThane} />
        <Route path="/top-10-preschools-thane-comparison-guide" component={LazyComparingPreschoolsThane} />
        <Route path="/comparing-preschools-thane" component={LazyComparingPreschoolsThane} />
        <Route path="/what-makes-great-preschool-checklist" component={LazyQualityPreschoolIndicators} />
        <Route path="/quality-preschool-indicators-parents-guide" component={LazyQualityPreschoolIndicators} />
        <Route path="/preschool-vs-daycare-difference-explained" component={LazyPreschoolVsDaycare} />
        <Route path="/preschool-vs-daycare-difference" component={LazyPreschoolVsDaycare} />
        <Route path="/early-childhood-education-importance-india" component={LazyEarlyChildhoodEducationImportance} />
        <Route path="/early-childhood-education-importance" component={LazyEarlyChildhoodEducationImportance} />
        
        {/* About page supporting blog posts */}
        <Route path="/rainbow-preschool-journey-2007-to-2026" component={LazyRainbowPreschoolJourneySince2007} />
        <Route path="/rainbow-preschool-journey-since-2007" component={LazyRainbowPreschoolJourneySince2007} />
        <Route path="/rainbow-preschool-awards-achievements" component={LazyRainbowPreschoolAwards} />
        <Route path="/rainbow-preschool-awards-recognition" component={LazyRainbowPreschoolAwards} />
        <Route path="/rainbow-preschool-teacher-training-philosophy" component={LazyTeacherTrainingQuality} />
        <Route path="/teacher-training-quality-preschool" component={LazyTeacherTrainingQuality} />
        <Route path="/parent-testimonials-rainbow-preschool-thane" component={LazyParentTestimonialsExperiences} />
        <Route path="/parent-testimonials-rainbow-preschool" component={LazyParentTestimonialsExperiences} />
        <Route path="/rainbow-preschool-safety-measures-child-security" component={LazyChildSafetyPreschool} />
        <Route path="/child-safety-preschool-standards" component={LazyChildSafetyPreschool} />
        
        {/* Programmes page supporting blog posts */}
        <Route path="/play-based-learning-benefits-children" component={LazyPlayBasedLearningBenefits} />
        <Route path="/nep-2020-early-childhood-education-guide" component={LazyNEP2020EarlyChildhoodGuide} />
        <Route path="/holistic-child-development-preschool" component={LazyHolisticChildDevelopment} />
        <Route path="/preschool-learning-outcomes-what-to-expect" component={LazyPreschoolLearningOutcomes} />
        
        {/* Playgroup page supporting blog posts */}
        <Route path="/benefits-playgroup-toddlers-development" component={LazyBenefitsPlaygroupToddlers} />
        <Route path="/playgroup-vs-staying-home-which-better" component={LazyPlaygroupVsStayingHome} />
        <Route path="/separation-anxiety-playgroup-tips-parents" component={LazySeparationAnxietyPlaygroup} />
        <Route path="/playgroup-activities-toddler-development" component={LazyPlaygroupActivities} />
        <Route path="/right-age-start-playgroup-india" component={LazyRightAgeStartPlaygroup} />
        
        {/* Nursery page supporting blog posts */}
        <Route path="/nursery-school-benefits-2-3-year-olds" component={LazyNurserySchoolBenefits} />
        <Route path="/nursery-vs-playgroup-difference" component={LazyNurseryVsPlaygroup} />
        <Route path="/nursery-curriculum-what-children-learn" component={LazyNurseryCurriculum} />
        <Route path="/preparing-child-nursery-school" component={LazyPreparingChildNursery} />
        <Route path="/nursery-admission-age-requirements-india" component={LazyNurseryAdmissionAge} />
        
        {/* Kindergarten page supporting blog posts */}
        <Route path="/kindergarten-readiness-checklist-parents" component={LazyKindergartenReadiness} />
        <Route path="/jr-kg-sr-kg-difference-explained" component={LazyJrKgSrKgDifference} />
        <Route path="/kindergarten-curriculum-primary-school-preparation" component={LazyKindergartenCurriculumPreparation} />
        <Route path="/choosing-right-kindergarten-child" component={LazyChoosingRightKindergarten} />
        <Route path="/kindergarten-admission-thane-guide" component={LazyKindergartenAdmissionThane} />
        
        {/* Admissions page supporting blog posts */}
        <Route path="/preschool-admission-process-explained" component={LazyPreschoolAdmissionProcess} />
        <Route path="/preschool-admission-documents-checklist" component={LazyPreschoolAdmissionDocuments} />
        <Route path="/when-apply-preschool-admission-timeline" component={LazyWhenApplyPreschoolTimeline} />
        <Route path="/questions-ask-preschool-admission-visit" component={LazyQuestionsAskPreschoolVisit} />
        <Route path="/preschool-fees-thane-what-to-expect" component={LazyPreschoolFeesThane} />
        
        {/* Contact page supporting blog posts */}
        <Route path="/visiting-preschool-what-to-look-for" component={LazyVisitingPreschoolGuide} />
        <Route path="/how-reach-rainbow-preschool-thane" component={LazyHowReachRainbowPreschool} />
        
        {/* Centre-specific local SEO blog posts */}
        <Route path="/early-childhood-education-manpada-ghodbunder-road" component={LazyEarlyChildhoodManpadaGB} />
        <Route path="/child-development-programs-hariniwas-naupada" component={LazyChildDevelopmentHariniwas} />
        <Route path="/best-playschool-anand-nagar-majiwada" component={LazyBestPlayschoolAnandNagar} />
        <Route path="/preschool-options-dhokali-kolshet-road" component={LazyPreschoolOptionsDhokali} />
        <Route path="/trusted-preschool-kalwa-thane" component={LazyTrustedPreschoolKalwa} />
        <Route path="/quality-preschool-kasarvadavali-ghodbunder" component={LazyQualityPreschoolKasarvadavali} />
        <Route path="/toddler-activities-manpada-preschool" component={LazyToddlerActivitiesManpada} />
        <Route path="/school-readiness-hariniwas-kindergarten" component={LazySchoolReadinessHariniwas} />
        <Route path="/nursery-admissions-anand-nagar-thane" component={LazyNurseryAdmissionsAnandNagar} />
        <Route path="/playgroup-enrollment-dhokali-thane" component={LazyPlaygroupEnrollmentDhokali} />
        <Route path="/kindergarten-programs-kalwa-thane" component={LazyKindergartenProgramsKalwa} />
        <Route path="/best-nursery-school-kasarvadavali" component={LazyBestNurseryKasarvadavali} />
        
        {/* NEW SEO BLOG POSTS - BATCH 2 */}
        {/* Homepage supporting posts (new) */}
        <Route path="/best-early-learning-centres-thane-2026" component={LazyBestEarlyLearningCentresThane} />
        <Route path="/montessori-vs-play-based-preschool-thane" component={LazyMontessoriVsPlayBased} />
        <Route path="/preschool-franchise-vs-standalone-which-better" component={LazyFranchiseVsStandalone} />
        <Route path="/working-parents-guide-preschool-thane" component={LazyWorkingParentsGuide} />
        <Route path="/affordable-quality-preschools-thane" component={LazyAffordableQualityPreschools} />
        
        {/* About page supporting posts (new) */}
        <Route path="/rainbow-preschool-teaching-methodology" component={LazyRainbowTeachingMethodology} />
        <Route path="/rainbow-preschool-infrastructure-facilities" component={LazyRainbowInfrastructureFacilities} />
        <Route path="/preschool-accreditation-importance-india" component={LazyPreschoolAccreditationImportance} />
        <Route path="/rainbow-preschool-community-initiatives" component={LazyRainbowCommunityInitiatives} />
        <Route path="/experienced-preschool-teachers-importance" component={LazyExperiencedTeachersImportance} />
        
        {/* Programmes page supporting posts (new) */}
        <Route path="/early-childhood-curriculum-explained" component={LazyEarlyChildhoodCurriculumExplained} />
        <Route path="/activity-based-learning-preschool-benefits" component={LazyActivityBasedLearningBenefits} />
        <Route path="/creative-arts-preschool-importance" component={LazyCreativeArtsPreschool} />
        <Route path="/physical-development-preschool-activities" component={LazyPhysicalDevelopmentPreschool} />
        <Route path="/language-development-preschool-activities" component={LazyLanguageDevelopmentPreschool} />
        
        {/* Playgroup page supporting posts (new) */}
        <Route path="/toddler-separation-anxiety-guide" component={LazyToddlerSeparationAnxiety} />
        <Route path="/toddler-social-skills-development" component={LazyToddlerSocialSkills} />
        <Route path="/playgroup-daily-schedule-activities" component={LazyPlaygroupDailySchedule} />
        <Route path="/is-my-toddler-ready-for-playgroup" component={LazyToddlerReadyForPlaygroup} />
        <Route path="/benefits-of-early-playgroup-enrollment" component={LazyBenefitsEarlyPlaygroup} />
        
        {/* NEW SEO BLOG POSTS - BATCH 2 ADDITIONAL */}
        {/* Homepage supporting */}
        <Route path="/why-early-childhood-education-matters-thane-parents" component={LazyWhyEarlyChildhoodEducation} />
        <Route path="/choosing-best-preschool-thane-parent-guide" component={LazyChoosingBestPreschool} />
        <Route path="/holistic-child-development-rainbow-approach" component={LazyHolisticChildDevelopmentApproach} />
        <Route path="/preschool-vs-daycare-understanding-difference" component={LazyPreschoolVsDaycareDifference} />
        <Route path="/preparing-child-for-preschool-thane-tips" component={LazyPreparingChildForPreschool} />
        
        {/* About page supporting */}
        <Route path="/rainbow-preschool-teaching-philosophy-explained" component={LazyRainbowTeachingPhilosophy} />
        <Route path="/history-early-childhood-education-thane" component={LazyHistoryEarlyChildhoodThane} />
        <Route path="/what-makes-quality-preschool-teacher" component={LazyQualityPreschoolTeacher} />
        <Route path="/parent-teacher-partnership-early-education" component={LazyParentTeacherPartnership} />
        <Route path="/rainbow-preschool-awards-recognition-thane" component={LazyRainbowAwardsRecognition} />
        
        {/* Programmes page supporting */}
        <Route path="/age-appropriate-learning-activities-explained" component={LazyAgeAppropriateLearning} />
        <Route path="/play-based-learning-vs-academic-approach" component={LazyPlayBasedVsAcademic} />
        <Route path="/how-rainbow-curriculum-prepares-school-readiness" component={LazyRainbowCurriculumSchoolReadiness} />
        <Route path="/importance-creative-arts-early-childhood" component={LazyCreativeArtsEarlyChildhood} />
        <Route path="/physical-development-activities-preschoolers" component={LazyPhysicalDevelopmentActivities} />
        
        {/* Playgroup page supporting */}
        <Route path="/separation-anxiety-tips-playgroup-parents" component={LazySeparationAnxietyTips} />
        <Route path="/socialisation-benefits-toddlers-playgroup" component={LazySocialisationBenefitsToddlers} />
        
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
