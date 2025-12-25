import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CTASection } from "@/components/cta-section";
import { SEO } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { CountUp } from "@/components/count-up";
import { programmes, branches } from "@shared/schema";
import { Baby, BookOpen, GraduationCap, Palette, Sun, Heart, CheckCircle, ArrowRight, MapPin, Phone, Clock, Users, Star, Shield, ShieldCheck, Award, Sparkles, Bus, UsersRound, Gamepad2, Brain, Music, Brush, Shapes, MessageCircle, Activity, HandHeart, TreePine, Zap, Rocket, Target } from "lucide-react";
import { trackProgrammeView } from "@/lib/analytics";

const iconMap = {
  baby: Baby,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  palette: Palette,
  sun: Sun,
  heart: Heart,
};

interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

const programmeDetails: Record<string, {
  features: FeatureItem[];
  schedule: string;
  activities: string[];
  highlights: string[];
  whyChoose: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}> = {
  playgroup: {
    features: [
      { title: "Introduction to Colors and Shapes", description: "Learning to recognize and identify basic colors and shapes through fun activities.", icon: "shapes", gradient: "from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30" },
      { title: "Puppet Shows and Storytelling", description: "Engaging narratives that spark imagination and build listening skills.", icon: "message", gradient: "from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30" },
      { title: "Sensory Play Activities", description: "Hands-on exploration that stimulates cognitive and motor development.", icon: "hand-heart", gradient: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30" },
      { title: "Basic Motor Skill Development", description: "Activities designed to strengthen fine and gross motor abilities.", icon: "activity", gradient: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30" },
      { title: "Social Interaction with Peers", description: "Learning to share, cooperate, and build friendships with other children.", icon: "users-round", gradient: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30" },
      { title: "Language Development through Songs", description: "Building vocabulary and speech through rhymes and musical activities.", icon: "music", gradient: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30" }
    ],
    schedule: "2-3 hours daily, flexible timing",
    activities: ["Circle time", "Music and movement", "Art exploration", "Free play", "Outdoor activities", "Rhymes and songs"],
    highlights: ["Small batch sizes for individual attention", "Trained and caring teachers", "Safe and hygienic environment", "Regular parent updates"],
    whyChoose: [
      "Age-appropriate learning activities",
      "Focus on sensory and motor development",
      "Gentle introduction to school routine",
      "Play-based curriculum"
    ],
    seoTitle: "Playgroup Admission in Thane | Rainbow Preschool International",
    seoDescription: "Enroll your child (1.5-2.5 years) in Rainbow Preschool's Playgroup programme. Play-based learning with puppet shows, colors, shapes & sensory activities. Best playgroup in Thane West.",
    seoKeywords: "playgroup admission thane, playgroup near me, playgroup for 2 year old, best playgroup thane, toddler school thane, playgroup fees, playgroup admission 2025, pre nursery thane, early learning center thane"
  },
  nursery: {
    features: [
      { title: "Alphabet and Number Recognition", description: "Building foundation for reading and math through interactive learning.", icon: "book", gradient: "from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30" },
      { title: "Group Reading Sessions", description: "Developing early literacy skills through shared reading experiences.", icon: "message", gradient: "from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30" },
      { title: "Creative Arts and Crafts", description: "Expressing creativity through painting, drawing, and craft projects.", icon: "brush", gradient: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30" },
      { title: "Physical Development through Yoga", description: "Building flexibility, balance, and body awareness.", icon: "activity", gradient: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30" },
      { title: "Basic Writing Skills", description: "Learning to hold pencils and form letters and numbers.", icon: "shapes", gradient: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30" },
      { title: "Cognitive Skill Development", description: "Puzzles and activities that enhance thinking and problem-solving.", icon: "brain", gradient: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30" }
    ],
    schedule: "3-4 hours daily",
    activities: ["Phonics introduction", "Dancing and singing", "Puppet shows", "Outdoor play", "Story time", "Number games"],
    highlights: ["Structured learning environment", "Phonics-based reading approach", "Regular assessments", "Parent-teacher meetings"],
    whyChoose: [
      "Foundation for reading and writing",
      "Balanced academic and play activities",
      "Experienced and trained faculty",
      "Holistic child development"
    ],
    seoTitle: "Nursery Admission in Thane | Rainbow Preschool International",
    seoDescription: "Nursery admission open for children 2.5-3.5 years at Rainbow Preschool Thane. Phonics, reading, arts & crafts, yoga. 17+ years of excellence. Enroll now!",
    seoKeywords: "nursery admission thane, nursery school near me, best nursery school thane, nursery fees thane, nursery admission 2025, pre primary school thane, nursery school syllabus, top nursery schools thane"
  },
  kindergarten: {
    features: [
      { title: "Reading and Writing Readiness", description: "Preparing children for fluent reading and writing skills.", icon: "book", gradient: "from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30" },
      { title: "Math Concepts and Problem Solving", description: "Learning numbers, counting, and basic mathematical operations.", icon: "brain", gradient: "from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30" },
      { title: "Science Exploration (EVS)", description: "Discovering the natural world through experiments and observation.", icon: "sparkles", gradient: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30" },
      { title: "General Knowledge Building", description: "Learning about the world, culture, and current events.", icon: "target", gradient: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30" },
      { title: "Computer Awareness Basics", description: "Introduction to computers and digital literacy.", icon: "zap", gradient: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30" },
      { title: "Personality Development", description: "Building confidence, communication, and social skills.", icon: "rocket", gradient: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30" }
    ],
    schedule: "4-5 hours daily",
    activities: ["English language arts", "Mathematics", "Art & Craft", "Sports and games", "Science experiments", "Public speaking"],
    highlights: ["School readiness programme", "Subject-wise curriculum", "Regular homework and assessments", "Annual day celebrations"],
    whyChoose: [
      "Complete preparation for Grade 1",
      "Strong academic foundation",
      "Confidence building activities",
      "Experienced kindergarten teachers"
    ],
    seoTitle: "Kindergarten Admission in Thane | LKG UKG | Rainbow Preschool",
    seoDescription: "Kindergarten (LKG/UKG) admission for 3.5-5 year olds at Rainbow Preschool Thane. Math, English, EVS, GK & personality development. Best KG school in Thane West.",
    seoKeywords: "kindergarten admission thane, lkg admission thane, ukg admission thane, kg school near me, best kindergarten thane, junior kg admission, senior kg admission, lkg ukg fees, pre primary school thane"
  },
  "kids-activity-club": {
    features: [
      { title: "20+ Engaging Activities", description: "A wide variety of activities to keep children entertained and learning.", icon: "sparkles", gradient: "from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30" },
      { title: "Brain Gym Exercises", description: "Activities designed to enhance cognitive abilities and focus.", icon: "brain", gradient: "from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30" },
      { title: "Creative Arts and Drama", description: "Expressing creativity through art, drama, and performance.", icon: "brush", gradient: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30" },
      { title: "Physical Fitness Programs", description: "Building strength, coordination, and healthy habits.", icon: "activity", gradient: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30" },
      { title: "Music and Dance Classes", description: "Learning rhythm, movement, and musical expression.", icon: "music", gradient: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30" },
      { title: "Personality Development", description: "Building confidence, communication, and leadership skills.", icon: "rocket", gradient: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30" }
    ],
    schedule: "Flexible after-school hours",
    activities: ["Aerobics", "Drama", "Art classes", "Brain development games", "Public speaking", "Craft workshops"],
    highlights: ["After-school activity programme", "Variety of skill-building activities", "Age-appropriate grouping", "Qualified activity coaches"],
    whyChoose: [
      "Develops multiple intelligences",
      "Keeps children productively engaged",
      "Builds confidence and creativity",
      "Flexible timings for working parents"
    ],
    seoTitle: "Kids Activity Club in Thane | After School Activities | Rainbow Preschool",
    seoDescription: "Join Rainbow Preschool's Kids Activity Club for children 2-10 years. 20+ activities including brain gym, aerobics, drama, art & craft. Best after-school program in Thane.",
    seoKeywords: "kids activity club thane, after school activities thane, kids activities near me, children activities thane, art classes for kids thane, drama classes thane, hobby classes for kids, extracurricular activities thane"
  },
  "summer-camp": {
    features: [
      { title: "Fun Holiday Activities", description: "Exciting and engaging activities to make the most of summer break.", icon: "sparkles", gradient: "from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30" },
      { title: "Creative Workshops", description: "Hands-on workshops for art, craft, and creative expression.", icon: "brush", gradient: "from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30" },
      { title: "Team Building Games", description: "Group activities that build cooperation and teamwork skills.", icon: "users-round", gradient: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30" },
      { title: "New Friendships", description: "Meeting new friends and building lasting bonds.", icon: "hand-heart", gradient: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30" },
      { title: "Outdoor Adventures", description: "Exploring nature and outdoor activities for active fun.", icon: "tree-pine", gradient: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30" },
      { title: "Skill Development", description: "Learning new skills while having fun during vacation.", icon: "rocket", gradient: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30" }
    ],
    schedule: "Summer vacation period",
    activities: ["Arts and crafts", "Sports", "Music", "Outdoor adventures", "Swimming", "Cooking classes"],
    highlights: ["Exciting summer vacation programme", "Safe and fun environment", "Daily new activities", "End of camp celebrations"],
    whyChoose: [
      "Productive use of summer break",
      "Makes learning fun",
      "Develops social skills",
      "Creates lasting memories"
    ],
    seoTitle: "Summer Camp for Kids in Thane 2025 | Rainbow Preschool International",
    seoDescription: "Enroll your child in Rainbow Preschool's Summer Camp in Thane. Fun activities, arts & crafts, sports, music for kids 2-10 years. Best summer camp near Thane West.",
    seoKeywords: "summer camp thane, summer camp for kids, summer camp near me, kids summer camp 2025, summer activities for children, summer vacation camp thane, holiday camp for kids, best summer camp thane"
  },
  "happy-times": {
    features: [
      { title: "Safe and Nurturing Environment", description: "A loving space where children feel secure and cared for.", icon: "shield-check", gradient: "from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30" },
      { title: "Flexible Hours for Working Parents", description: "Extended timings to accommodate working parents' schedules.", icon: "activity", gradient: "from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30" },
      { title: "Nutritious Meals Provided", description: "Healthy, home-cooked meals to keep children energized.", icon: "hand-heart", gradient: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30" },
      { title: "Engaging Activities Throughout the Day", description: "Fun activities to keep children productively occupied.", icon: "sparkles", gradient: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30" },
      { title: "Homework Assistance", description: "Help with schoolwork and academic support.", icon: "book", gradient: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30" },
      { title: "Rest and Nap Time", description: "Quiet time for children to rest and recharge.", icon: "music", gradient: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30" }
    ],
    schedule: "Extended hours available (8 AM - 7 PM)",
    activities: ["100% female staff", "Homely care for children", "CCTV surveillance across all areas", "Indoor and outdoor play"],
    highlights: ["Extended daycare facility", "Trained female caregivers only", "Home-cooked nutritious meals", "Pick-up and drop facility available"],
    whyChoose: [
      "Peace of mind for working parents",
      "Safe and secure environment",
      "Engaging and productive time",
      "Flexible timing options"
    ],
    seoTitle: "Daycare in Thane | Happy Times | Rainbow Preschool International",
    seoDescription: "Rainbow Preschool's Happy Times daycare in Thane for children 1.5-6 years. 100% female staff, CCTV monitoring, nutritious meals. Best daycare facility near Thane West.",
    seoKeywords: "daycare thane, daycare near me, best daycare thane, childcare thane, creche thane, baby daycare, toddler daycare, working parents daycare, extended daycare thane, child care center thane"
  },
};

const urlToId: Record<string, string> = {
  "playgroup": "playgroup",
  "nursery": "nursery",
  "kindergarten": "kindergarten",
  "kids-activity-club": "kids-activity-club",
  "summer-camp": "summer-camp",
  "happy-times": "happy-times",
};

const featureIconMap: Record<string, typeof ShieldCheck> = {
  "shield-check": ShieldCheck,
  "award": Award,
  "sparkles": Sparkles,
  "users-round": UsersRound,
  "bus": Bus,
  "gamepad": Gamepad2,
  "shapes": Shapes,
  "message": MessageCircle,
  "hand-heart": HandHeart,
  "activity": Activity,
  "music": Music,
  "book": BookOpen,
  "brush": Brush,
  "brain": Brain,
  "target": Target,
  "zap": Zap,
  "rocket": Rocket,
  "tree-pine": TreePine,
};

interface ProgrammeLandingProps {
  programmeSlug: string;
}

export default function ProgrammeLanding({ programmeSlug }: ProgrammeLandingProps) {
  const programmeId = urlToId[programmeSlug.toLowerCase()] || programmeSlug.toLowerCase();
  const programme = programmes.find(p => p.id === programmeId);
  const details = programmeDetails[programmeId];

  useEffect(() => {
    if (programme) {
      trackProgrammeView(programme.id);
    }
  }, [programme]);

  if (!programme || !details) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Programme Not Found</h1>
          <Link href="/programmes">
            <Button>View All Programmes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[programme.icon as keyof typeof iconMap] || Baby;

  return (
    <div className="pt-20">
      <SEO
        title={details.seoTitle}
        description={details.seoDescription}
        keywords={details.seoKeywords}
        canonical={`https://rainbowpreschools.com/${programmeSlug.toLowerCase()}`}
      />

      {/* Hero Section */}
      <section className="py-24 md:py-32 lg:py-40 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center flex flex-col items-center justify-center">
            <Badge variant="secondary" className="text-base px-4 py-1 mb-4">
              {programme.ageRange}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">{programme.name}</h1>
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                Get In Touch
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Request a Callback</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Submit your details and queries here. We'd be glad to help you out!
              </p>
            </div>
            <Card className="shadow-lg">
              <CardContent className="p-6 md:p-8">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">We Give Your Child Better Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              At Rainbow Preschools, we believe every child deserves the best start in life. Here's what makes us different.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {details.features.map((feature, index) => {
              const FeatureIcon = featureIconMap[feature.icon] || ShieldCheck;
              const iconColors: Record<string, string> = {
                "shield-check": "text-pink-500",
                "award": "text-sky-500",
                "sparkles": "text-green-500",
                "users-round": "text-purple-500",
                "bus": "text-orange-500",
                "gamepad": "text-blue-500",
                "shapes": "text-pink-500",
                "message": "text-sky-500",
                "hand-heart": "text-green-500",
                "activity": "text-purple-500",
                "music": "text-blue-500",
                "book": "text-pink-500",
                "brush": "text-green-500",
                "brain": "text-sky-500",
                "target": "text-purple-500",
                "zap": "text-orange-500",
                "rocket": "text-blue-500",
                "tree-pine": "text-orange-500",
              };
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-[0_4px_0_0_rgba(0,0,0,0.1)] mb-4`}>
                    <FeatureIcon className={`w-7 h-7 ${iconColors[feature.icon] || "text-primary"}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our {programme.name}?</h2>
              <ul className="space-y-4">
                {details.whyChoose.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                    <span className="text-lg text-muted-foreground">{reason}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <strong>Timings:</strong>
                    <div className="mt-1 space-y-1">
                      <div>Morning Batch - 8:30AM to 11:30AM</div>
                      <div>Afternoon Batch - 12:30PM to 3:30PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-6">
                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">
                  <CountUp end={50000} duration={2000} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">Happy Students</div>
              </Card>
              <Card className="text-center p-6">
                <Star className="w-10 h-10 text-secondary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">
                  <CountUp end={18} duration={1500} delay={200} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">Years of Excellence</div>
              </Card>
              <Card className="text-center p-6">
                <MapPin className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">
                  <CountUp end={6} duration={1500} delay={400} prefix="0" />
                </div>
                <div className="text-sm text-muted-foreground">Centres in Thane</div>
              </Card>
              <Card className="text-center p-6">
                <Shield className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">
                  <CountUp end={100} duration={1500} delay={600} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">Female Staff</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Daily Activities</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A variety of engaging activities to keep your child learning and having fun.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {details.activities.map((activity, index) => (
              <Badge key={index} variant="outline" className="text-base px-4 py-2">
                {activity}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Programme Highlights */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Programme Highlights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {details.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-background rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-foreground">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Centres Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Centres</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {programme.name} is available at all our 6 centres across Thane West.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.slice(0, 6).map((branch) => (
              <Card key={branch.id} className="hover-elevate">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{branch.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{branch.address}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{branch.calling}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={`Ready to Enroll in ${programme.name}?`}
        description="Contact us today to schedule a centre visit and learn more about our admission process."
      />
    </div>
  );
}
