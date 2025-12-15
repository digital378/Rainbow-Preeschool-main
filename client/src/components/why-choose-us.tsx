import { Card, CardContent } from "@/components/ui/card";
import { Award, Building2, BookOpen, Users, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Certified Teachers",
    description: "Our Educators are completely certified, exceptionally experienced, and fiercely committed to their jobs.",
    color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  },
  {
    icon: Building2,
    title: "Modern Facility",
    description: "Two Teachers per Classroom, CCTV Enabled, Spacious & Air Conditioned, Child Friendly & Smart Classrooms.",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    icon: BookOpen,
    title: "Research-Based Curriculum",
    description: "Learning goes beyond books with events, celebrations, 100% participation, and audio-visual teaching aids.",
    color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  },
  {
    icon: Users,
    title: "Small Class Sizes",
    description: "Individual attention for every child with optimal student-to-teacher ratios for better learning outcomes.",
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
  {
    icon: Shield,
    title: "Safe Environment",
    description: "CCTV monitoring, trained staff, secure premises, and comprehensive safety protocols for peace of mind.",
    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  },
  {
    icon: Sparkles,
    title: "Holistic Development",
    description: "Focus on cognitive, emotional, social, and physical development through play-based learning approaches.",
    color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            We Give Your Child Better Values
          </h2>
          <p className="text-muted-foreground text-lg">
            At Rainbow Preschool, we believe every child deserves the best start in life. 
            Here's what makes us different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-none bg-transparent"
              data-testid={`card-feature-${index}`}
            >
              <CardContent className="pt-6 text-center">
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
