import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Sparkles, Users, Bus, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Shield,
    title: "Safety & CCTV",
    description: "CCTV-monitored premises with 100% female teaching staff for a secure environment.",
    bg: "bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800/40 dark:to-pink-900/40",
    iconColor: "text-pink-600 dark:text-pink-400",
    shadow: "shadow-[0_4px_0_0_rgb(219,39,119),0_6px_12px_-2px_rgba(219,39,119,0.3)] dark:shadow-[0_4px_0_0_rgb(157,23,77),0_6px_12px_-2px_rgba(219,39,119,0.2)]",
  },
  {
    icon: Award,
    title: "Certified Teachers",
    description: "ECCEd certified & experienced teachers who nurture every child with love and attention.",
    bg: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800/40 dark:to-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    shadow: "shadow-[0_4px_0_0_rgb(37,99,235),0_6px_12px_-2px_rgba(37,99,235,0.3)] dark:shadow-[0_4px_0_0_rgb(30,64,175),0_6px_12px_-2px_rgba(37,99,235,0.2)]",
  },
  {
    icon: Sparkles,
    title: "Hygiene & Cleanliness",
    description: "Daily sanitisation, child-safe washrooms, and hygiene-first practices.",
    bg: "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800/40 dark:to-green-900/40",
    iconColor: "text-green-600 dark:text-green-400",
    shadow: "shadow-[0_4px_0_0_rgb(22,163,74),0_6px_12px_-2px_rgba(22,163,74,0.3)] dark:shadow-[0_4px_0_0_rgb(21,128,61),0_6px_12px_-2px_rgba(22,163,74,0.2)]",
  },
  {
    icon: Users,
    title: "Ideal Student-Teacher Ratio",
    description: "30:2 ratio ensuring personalised care and individual attention for every child.",
    bg: "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800/40 dark:to-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    shadow: "shadow-[0_4px_0_0_rgb(147,51,234),0_6px_12px_-2px_rgba(147,51,234,0.3)] dark:shadow-[0_4px_0_0_rgb(107,33,168),0_6px_12px_-2px_rgba(147,51,234,0.2)]",
  },
  {
    icon: Bus,
    title: "Transport Facility",
    description: "Safe, GPS-enabled in-house transport with real-time tracking for parents.",
    bg: "bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800/40 dark:to-orange-900/40",
    iconColor: "text-orange-600 dark:text-orange-400",
    shadow: "shadow-[0_4px_0_0_rgb(234,88,12),0_6px_12px_-2px_rgba(234,88,12,0.3)] dark:shadow-[0_4px_0_0_rgb(194,65,12),0_6px_12px_-2px_rgba(234,88,12,0.2)]",
  },
  {
    icon: Gamepad2,
    title: "Play-Based Learning",
    description: "Holistic, play-based curriculum for confident early development and growth.",
    bg: "bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-800/40 dark:to-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    shadow: "shadow-[0_4px_0_0_rgb(13,148,136),0_6px_12px_-2px_rgba(13,148,136,0.3)] dark:shadow-[0_4px_0_0_rgb(17,94,89),0_6px_12px_-2px_rgba(13,148,136,0.2)]",
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
            Best Preschool in Thane
          </h2>
          <p className="text-muted-foreground text-lg">
            At Rainbow Preschools, we believe every child deserves the best start in life. 
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
                <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4",
                    feature.bg,
                    feature.shadow
                  )}>
                    <feature.icon className={cn("w-7 h-7", feature.iconColor)} />
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
