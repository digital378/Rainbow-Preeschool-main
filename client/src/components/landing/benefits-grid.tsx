import { Card, CardContent } from "@/components/ui/card";
import { Baby, Users, Shield, Heart, Sparkles, Clock, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  baby: Baby,
  users: Users,
  shield: Shield,
  heart: Heart,
  sparkles: Sparkles,
  clock: Clock,
};

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface BenefitsGridProps {
  benefits: Benefit[];
}

export function BenefitsGrid({ benefits }: BenefitsGridProps) {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12" data-reveal="float">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" data-sparkle>Why Choose Rainbow Preschool?</h2>
          <p className="text-muted-foreground">Trusted by thousands of families across Thane</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" data-stagger="children">
          {benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon] || Heart;
            return (
              <Card
                key={benefit.title}
                className="group hover-elevate"
                data-reveal="pop"
                data-testid={`benefit-card-${index}`}
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" data-float-icon>
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
