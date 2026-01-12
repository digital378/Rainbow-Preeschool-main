import { LegacyLandingPage, AuthorArchivePage } from "@/components/legacy-landing-page";
import { legacyPagesData, getLegacyPageData } from "@shared/legacy-pages-data";

function createLegacyPage(slug: string) {
  return function LegacyPage() {
    const data = getLegacyPageData(slug);
    if (!data) {
      return null;
    }
    return <LegacyLandingPage data={data} />;
  };
}

export const MotivationalThoughtsForKids = createLegacyPage("/36-motivational-thoughts-of-the-day-for-kids/");
export const FruitsVegetablesEnglishHindi = createLegacyPage("/explore-50-fruits-vegetables-english-hindi/");
export const MidTermPlaygroupBenefits = createLegacyPage("/mid-term-playgroup-admissions-benefits/");
export const NationalSymbolsOfIndia = createLegacyPage("/national-symbols-of-india-for-kids/");
export const SolitaryPlayActivities = createLegacyPage("/solitary-play-activities/");
export const PreKgAgeGuide = createLegacyPage("/pre-kg-age-guide/");
export const SpringGardeningActivities = createLegacyPage("/10-spring-gardening-activitie-for-preschoolers/");
export const MotivateKidsForSchool = createLegacyPage("/how-to-motivate-your-kids-for-school-8-ways/");
export const IndoorGamesForKids = createLegacyPage("/best-indoor-games-for-kids-at-home/");
export const TeachingAidsHelp = createLegacyPage("/7-ways-teaching-aids-help-children-learn-better/");
export const PreschoolVsPreKg = createLegacyPage("/preschool-vs-prekg-2/");
export const PreschoolAdmissionGuide = createLegacyPage("/preschool-admission-process-guide/");
export const SportsDayActivities = createLegacyPage("/sports-day-activities-for-kindergarten/");
export const GoodTouchBadTouch = createLegacyPage("/guide-to-understanding-good-touch-and-bad-touch/");
export const BodyPartsNames = createLegacyPage("/body-parts-names-in-english-for-preschoolers/");
export const RainySeasonActivities = createLegacyPage("/rainy-season-activities-for-kindergarten/");
export const ListeningSkillsTips = createLegacyPage("/6-simple-tips-for-improving-listening-skills-in-preschoolers/");
export const DiwaliActivities = createLegacyPage("/diwali-activity-for-kindergarten/");
export const ParentTeacherCommunication = createLegacyPage("/impact-of-parent-teacher-communication-on-student-success/");
export const HoliActivities = createLegacyPage("/holi-activities-for-kids/");
export const OvercomeFear = createLegacyPage("/7-things-you-can-do-to-help-children-overcome-fear/");
export const PlayEmotionalGrowth = createLegacyPage("/importance-of-play-in-childrens-emotional-growth/");
export const ForgetManners = createLegacyPage("/what-makes-children-forget-their-manners/");
export const TrendsEarlyChildhood = createLegacyPage("/trends-in-early-childhood-education/");
export const HealthyPreschoolMeals = createLegacyPage("/healthy-preschool-meals-for-bright-minds-and-bodies/");
export const EducationalToys = createLegacyPage("/boost-early-childhood-development-with-educational-toys/");
export const MidTermSocialDevelopment = createLegacyPage("/how-mid-term-admission-open-for-playgroup-supports-social-and-emotional-development/");
export const Admissions2425 = createLegacyPage("/admissions-24-25/");
export const InnovativeLearning = createLegacyPage("/innovative-learning-activities-for-preschoolers/");
export const MidTermPlaygroup = createLegacyPage("/mid-term-playgroup/");
export const BrainGymActivities = createLegacyPage("/brain-gym-activities-for-preschoolers/");
export const ImmunityBoostingFoods = createLegacyPage("/immunity-boosting-foods-for-kids/");
export const ColorsAndShapes = createLegacyPage("/10-easy-ways-to-help-kids-learn-colours-and-shapes-better/");
export const CookingForKids = createLegacyPage("/8-amazing-reasons-why-cooking-is-important-for-kids/");
export const ParentsGuideMidTerm = createLegacyPage("/parents-guide-mid-term-playgroup-admission/");
export const LearnWritingTips = createLegacyPage("/6-quick-tips-to-help-children-learn-writing/");
export const EvenOddNumbers = createLegacyPage("/fun-games-teach-even-odd-numbers/");
export const PreschoolTourQuestions = createLegacyPage("/what-to-ask-during-a-tour-of-a-preschool-in-thane/");
export const ChoosingPreschoolQuestions = createLegacyPage("/9-questions-to-ask-while-choosing-a-pre-school/");
export const InteractiveLearning = createLegacyPage("/fun-interactive-learning-activities-for-preschoolers-2/");
export const SummerActivities = createLegacyPage("/innovative-summer-activities-for-kids-keeping-minds-engaged/");
export const CleanestSchoolAward = createLegacyPage("/rainbow-family-wins-cleanest-school-thane/");
export const PreschoolDevelopment = createLegacyPage("/why-preschool-education-shapes-early-childhood-development/");
export const MidTermPlaygroupAdmission = createLegacyPage("/mid-term-playgroup-admission/");
export const NurseryImportance = createLegacyPage("/why-nursery-school-is-important-for-early-childhood-development/");
export const PromisingPreschoolAward = createLegacyPage("/the-most-promising-preschool-chain-of-the-year-maharashtra/");
export const LifeLessonsConfidence = createLegacyPage("/51-inspiring-life-lessons-that-make-children-confident/");
export const GamesMakeKidsSmarter = createLegacyPage("/play-these-9-games-to-make-kids-smarter/");
export const PhysicalDevelopmentSigns = createLegacyPage("/45-signs-of-healthy-physical-development-ages-3-6/");
export const MidTermVisitQuestions = createLegacyPage("/questions-ask-school-visit-mid-term-playgroup-admissions/");
export const FAQsPage = createLegacyPage("/faqs/");
export const UnderstandingPreschoolImportance = createLegacyPage("/understanding-the-importance-of-preschool-in-early-childhood-development/");

export const BestPreschoolCurriculumThane = createLegacyPage("/best-preschool-curriculum-thane/");
export const HowToChooseBestPreschool = createLegacyPage("/how-to-choose-best-preschool-thane/");
export const PlaygroupAdmissionGuide = createLegacyPage("/playgroup-admission-thane-complete-guide/");

// Homepage supporting posts (primary URLs)
export const RainbowPreschoolCentresThane = createLegacyPage("/why-rainbow-preschool-best-thane-2026/");
export const ComparingPreschoolsThane = createLegacyPage("/top-10-preschools-thane-comparison-guide/");
export const QualityPreschoolIndicators = createLegacyPage("/what-makes-great-preschool-checklist/");
export const PreschoolVsDaycare = createLegacyPage("/preschool-vs-daycare-difference-explained/");
export const EarlyChildhoodEducationImportance = createLegacyPage("/early-childhood-education-importance-india/");

// About page supporting posts (primary URLs)
export const RainbowPreschoolJourneySince2007 = createLegacyPage("/rainbow-preschool-journey-2007-to-2026/");
export const RainbowPreschoolAwards = createLegacyPage("/rainbow-preschool-awards-achievements/");
export const TeacherTrainingQuality = createLegacyPage("/rainbow-preschool-teacher-training-philosophy/");
export const ParentTestimonialsExperiences = createLegacyPage("/parent-testimonials-rainbow-preschool-thane/");
export const ChildSafetyPreschool = createLegacyPage("/rainbow-preschool-safety-measures-child-security/");

// Alias exports for old URLs (point to same data as primary URLs)
export const RainbowPreschoolCentresThaneOld = RainbowPreschoolCentresThane;
export const ComparingPreschoolsThaneOld = ComparingPreschoolsThane;
export const QualityPreschoolIndicatorsOld = QualityPreschoolIndicators;
export const PreschoolVsDaycareOld = PreschoolVsDaycare;
export const EarlyChildhoodEducationImportanceOld = EarlyChildhoodEducationImportance;
export const RainbowPreschoolJourneySince2007Old = RainbowPreschoolJourneySince2007;
export const RainbowPreschoolAwardsOld = RainbowPreschoolAwards;
export const TeacherTrainingQualityOld = TeacherTrainingQuality;
export const ParentTestimonialsExperiencesOld = ParentTestimonialsExperiences;
export const ChildSafetyPreschoolOld = ChildSafetyPreschool;

// Programmes page supporting posts
export const PlayBasedLearningBenefits = createLegacyPage("/play-based-learning-benefits-children/");
export const NEP2020EarlyChildhoodGuide = createLegacyPage("/nep-2020-early-childhood-education-guide/");
export const HolisticChildDevelopment = createLegacyPage("/holistic-child-development-preschool/");
export const PreschoolLearningOutcomes = createLegacyPage("/preschool-learning-outcomes-what-to-expect/");

// Playgroup page supporting posts
export const BenefitsPlaygroupToddlers = createLegacyPage("/benefits-playgroup-toddlers-development/");
export const PlaygroupVsStayingHome = createLegacyPage("/playgroup-vs-staying-home-which-better/");
export const SeparationAnxietyPlaygroup = createLegacyPage("/separation-anxiety-playgroup-tips-parents/");
export const PlaygroupActivities = createLegacyPage("/playgroup-activities-toddler-development/");
export const RightAgeStartPlaygroup = createLegacyPage("/right-age-start-playgroup-india/");

// Nursery page supporting posts
export const NurserySchoolBenefits = createLegacyPage("/nursery-school-benefits-2-3-year-olds/");
export const NurseryVsPlaygroup = createLegacyPage("/nursery-vs-playgroup-difference/");
export const NurseryCurriculum = createLegacyPage("/nursery-curriculum-what-children-learn/");
export const PreparingChildNursery = createLegacyPage("/preparing-child-nursery-school/");
export const NurseryAdmissionAge = createLegacyPage("/nursery-admission-age-requirements-india/");

// Kindergarten page supporting posts
export const KindergartenReadiness = createLegacyPage("/kindergarten-readiness-checklist-parents/");
export const JrKgSrKgDifference = createLegacyPage("/jr-kg-sr-kg-difference-explained/");
export const KindergartenCurriculumPreparation = createLegacyPage("/kindergarten-curriculum-primary-school-preparation/");
export const ChoosingRightKindergarten = createLegacyPage("/choosing-right-kindergarten-child/");
export const KindergartenAdmissionThane = createLegacyPage("/kindergarten-admission-thane-guide/");

// Admissions page supporting posts
export const PreschoolAdmissionProcess = createLegacyPage("/preschool-admission-process-explained/");
export const PreschoolAdmissionDocuments = createLegacyPage("/preschool-admission-documents-checklist/");
export const WhenApplyPreschoolTimeline = createLegacyPage("/when-apply-preschool-admission-timeline/");
export const QuestionsAskPreschoolVisit = createLegacyPage("/questions-ask-preschool-admission-visit/");
export const PreschoolFeesThane = createLegacyPage("/preschool-fees-thane-what-to-expect/");

// Contact page supporting posts
export const VisitingPreschoolGuide = createLegacyPage("/visiting-preschool-what-to-look-for/");
export const HowReachRainbowPreschool = createLegacyPage("/how-reach-rainbow-preschool-thane/");

// Centre-specific local SEO posts
export const EarlyChildhoodManpadaGB = createLegacyPage("/early-childhood-education-manpada-ghodbunder-road/");
export const ChildDevelopmentHariniwas = createLegacyPage("/child-development-programs-hariniwas-naupada/");
export const BestPlayschoolAnandNagar = createLegacyPage("/best-playschool-anand-nagar-majiwada/");
export const PreschoolOptionsDhokali = createLegacyPage("/preschool-options-dhokali-kolshet-road/");
export const TrustedPreschoolKalwa = createLegacyPage("/trusted-preschool-kalwa-thane/");
export const QualityPreschoolKasarvadavali = createLegacyPage("/quality-preschool-kasarvadavali-ghodbunder/");
export const ToddlerActivitiesManpada = createLegacyPage("/toddler-activities-manpada-preschool/");
export const SchoolReadinessHariniwas = createLegacyPage("/school-readiness-hariniwas-kindergarten/");
export const NurseryAdmissionsAnandNagar = createLegacyPage("/nursery-admissions-anand-nagar-thane/");
export const PlaygroupEnrollmentDhokali = createLegacyPage("/playgroup-enrollment-dhokali-thane/");
export const KindergartenProgramsKalwa = createLegacyPage("/kindergarten-programs-kalwa-thane/");
export const BestNurseryKasarvadavali = createLegacyPage("/best-nursery-school-kasarvadavali/");

export { AuthorArchivePage };

export const legacySlugs = Object.keys(legacyPagesData);
