import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, FlaskConical, Dumbbell, Lightbulb, Brain, MessageCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const curriculumAreas = [
  {
    id: "art",
    label: "Art Studio",
    tooltip: "Creative expression through painting, drawing, and crafts",
    icon: Palette,
    bg: "bg-gradient-to-br from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(194,65,12),0_6px_12px_-2px_rgba(234,88,12,0.4)]",
  },
  {
    id: "maths",
    label: "Maths & Science",
    tooltip: "Early numeracy and scientific exploration through play",
    icon: FlaskConical,
    bg: "bg-gradient-to-br from-sky-400 to-sky-500 dark:from-sky-500 dark:to-sky-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(2,132,199),0_6px_12px_-2px_rgba(14,165,233,0.4)]",
  },
  {
    id: "sports",
    label: "Sports & Movement",
    tooltip: "Physical development through games and outdoor activities",
    icon: Dumbbell,
    bg: "bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-500 dark:to-teal-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(15,118,110),0_6px_12px_-2px_rgba(20,184,166,0.4)]",
  },
  {
    id: "skill",
    label: "Skill Development",
    tooltip: "Fine motor skills and practical life activities",
    icon: Lightbulb,
    bg: "bg-gradient-to-br from-green-400 to-green-500 dark:from-green-500 dark:to-green-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(22,163,74),0_6px_12px_-2px_rgba(34,197,94,0.4)]",
  },
  {
    id: "aptitude",
    label: "General Aptitude",
    tooltip: "Cognitive development and problem-solving abilities",
    icon: Brain,
    bg: "bg-gradient-to-br from-purple-400 to-purple-500 dark:from-purple-500 dark:to-purple-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(126,34,206),0_6px_12px_-2px_rgba(168,85,247,0.4)]",
  },
  {
    id: "bilingual",
    label: "Bilingual Education",
    tooltip: "Language skills in English and Hindi/Marathi",
    icon: MessageCircle,
    bg: "bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(180,83,9),0_6px_12px_-2px_rgba(245,158,11,0.4)]",
  },
];

export function MethodologySection() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              Our Methodology
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Research-Based Curriculum for Every Child
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              At Rainbow Preschool, our teachers are dedicated and nurturing. Their singular goal is to help your child meet milestones and become successful. We offer a path toward elementary school that can be personalized to meet each child's needs.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our curriculum is designed for preschool and playgroup children in Thane, supporting holistic early development through age-appropriate activities.
            </p>

            <Link href="/programmes">
              <Button size="lg" data-testid="button-methodology-programmes">
                View Our Programmes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Curriculum Areas Visual - Theme Adaptive */}
          <div className="relative flex items-center justify-center" data-testid="curriculum-visual">
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
              {/* Connecting curved lines */}
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 400 400"
                style={{ zIndex: 0 }}
              >
                {curriculumAreas.map((_, index) => {
                  const angle = (index * 60 - 90) * (Math.PI / 180);
                  const centerX = 200;
                  const centerY = 200;
                  const innerRadius = 70;
                  const outerRadius = 130;
                  
                  const x1 = centerX + Math.cos(angle) * innerRadius;
                  const y1 = centerY + Math.sin(angle) * innerRadius;
                  const x2 = centerX + Math.cos(angle) * outerRadius;
                  const y2 = centerY + Math.sin(angle) * outerRadius;
                  
                  return (
                    <line
                      key={index}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      className="stroke-primary/40"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>

              {/* Center Circle - Curriculum Icon with 3D effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 dark:from-pink-500 dark:via-pink-600 dark:to-pink-700 flex items-center justify-center shadow-[0_6px_0_0_rgb(157,23,77),0_8px_20px_-2px_rgba(219,39,119,0.5)] dark:shadow-[0_6px_0_0_rgb(131,24,67),0_8px_20px_-2px_rgba(219,39,119,0.35)] z-10">
                <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={1.5} />
              </div>

              {/* Curriculum Area Bubbles with 3D effect and tooltips */}
              {curriculumAreas.map((area, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const radius = 145;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const Icon = area.icon;
                
                return (
                  <Tooltip key={area.id}>
                    <TooltipTrigger asChild>
                      <div
                        className="absolute top-1/2 left-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer"
                        style={{
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        }}
                        data-testid={`curriculum-area-${area.id}`}
                      >
                        <div className={cn(
                          "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105",
                          area.bg,
                          area.shadow
                        )}>
                          <Icon className={cn("w-6 h-6 md:w-7 md:h-7", area.iconColor)} />
                        </div>
                        <span className="text-xs md:text-sm font-semibold text-foreground text-center whitespace-nowrap">
                          {area.label}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{area.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
