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

export { AuthorArchivePage };

export const legacySlugs = Object.keys(legacyPagesData);
