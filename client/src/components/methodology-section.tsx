import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Palette, FlaskConical, Dumbbell, Lightbulb, Brain, MessageCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from "react";

const curriculumAreas = [
  {
    id: "art",
    label: "Art Studio",
    shortLabel: "Art",
    tooltip: "Creative expression through painting, drawing, and crafts",
    benefit: "Creativity + fine motor skills",
    icon: Palette,
    bg: "bg-gradient-to-br from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(194,65,12),0_6px_12px_-2px_rgba(234,88,12,0.4)]",
  },
  {
    id: "maths",
    label: "Maths & Science",
    shortLabel: "STEM",
    tooltip: "Early numeracy and scientific exploration through play",
    benefit: "Logical thinking + curiosity",
    icon: FlaskConical,
    bg: "bg-gradient-to-br from-sky-400 to-sky-500 dark:from-sky-500 dark:to-sky-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(2,132,199),0_6px_12px_-2px_rgba(14,165,233,0.4)]",
  },
  {
    id: "sports",
    label: "Sports & Movement",
    shortLabel: "Sports",
    tooltip: "Physical development through games and outdoor activities",
    benefit: "Physical fitness + coordination",
    icon: Dumbbell,
    bg: "bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-500 dark:to-teal-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(15,118,110),0_6px_12px_-2px_rgba(20,184,166,0.4)]",
  },
  {
    id: "skill",
    label: "Skill Development",
    shortLabel: "Skills",
    tooltip: "Fine motor skills and practical life activities",
    benefit: "Independence + confidence",
    icon: Lightbulb,
    bg: "bg-gradient-to-br from-green-400 to-green-500 dark:from-green-500 dark:to-green-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(22,163,74),0_6px_12px_-2px_rgba(34,197,94,0.4)]",
  },
  {
    id: "aptitude",
    label: "General Aptitude",
    shortLabel: "Aptitude",
    tooltip: "Cognitive development and problem-solving abilities",
    benefit: "Critical thinking + focus",
    icon: Brain,
    bg: "bg-gradient-to-br from-purple-400 to-purple-500 dark:from-purple-500 dark:to-purple-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(126,34,206),0_6px_12px_-2px_rgba(168,85,247,0.4)]",
  },
  {
    id: "bilingual",
    label: "Bilingual Education",
    shortLabel: "Language",
    tooltip: "Language skills in English and Hindi/Marathi",
    benefit: "Communication + expression",
    icon: MessageCircle,
    bg: "bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(180,83,9),0_6px_12px_-2px_rgba(245,158,11,0.4)]",
  },
];

export function MethodologySection() {
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const activeAreaData = activeArea 
    ? curriculumAreas.find(a => a.id === activeArea) 
    : null;

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-20 lg:py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content - Left column with entrance animation */}
          <div 
            className={cn(
              "transition-all duration-700 ease-out",
              isVisible 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 -translate-x-8"
            )}
            style={{ transitionDelay: "100ms" }}
          >
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              Our Methodology
            </p>
            {/* Heading with proper underline using pseudo-element */}
            <h2 
              className="methodology-heading text-3xl md:text-4xl font-bold mb-6 pb-3 relative inline-block leading-tight"
              style={{ lineHeight: "1.1" }}
            >
              Research-Based Curriculum for Every Child
              <span 
                className="absolute left-0 bottom-0 h-1.5 md:h-2 w-full rounded-full bg-gradient-to-r from-primary via-pink-400 to-secondary"
                style={{ transform: "translateY(4px)" }}
                aria-hidden="true"
              />
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              At Rainbow Preschool, our teachers are dedicated and nurturing. Their singular goal is to help your child meet milestones and become successful. We offer a path toward elementary school that can be personalized to meet each child's needs.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Our curriculum is designed for preschool and playgroup children in Thane, supporting holistic early development through age-appropriate activities.
            </p>

            {/* Curriculum Explorer Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {curriculumAreas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => setActiveArea(activeArea === area.id ? null : area.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                    activeArea === area.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:border-border"
                  )}
                  data-testid={`chip-${area.id}`}
                >
                  {area.shortLabel}
                </button>
              ))}
            </div>

            {/* Active area description */}
            <div className="h-16 mb-6">
              {activeAreaData && (
                <div 
                  className="p-3 rounded-lg bg-muted/50 border animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                  <p className="font-semibold text-foreground">{activeAreaData.label}</p>
                  <p className="text-sm text-muted-foreground">{activeAreaData.benefit}</p>
                </div>
              )}
            </div>

            <Link href="/programmes">
              <Button size="lg" data-testid="button-methodology-programmes">
                View Our Programmes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Curriculum Areas Visual - Right column with entrance animation */}
          <div 
            className={cn(
              "relative flex items-center justify-center transition-all duration-700 ease-out",
              isVisible 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-95"
            )}
            style={{ transitionDelay: "300ms" }}
            data-testid="curriculum-visual"
          >
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
              {/* Sparkle gradient glow behind center */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-56 md:h-56 rounded-full opacity-30 blur-2xl motion-safe:animate-pulse"
                style={{
                  background: "radial-gradient(circle, rgba(236,72,153,0.6) 0%, rgba(244,114,182,0.3) 50%, transparent 70%)",
                  animationDuration: "4s",
                }}
                aria-hidden="true"
              />

              {/* Connecting curved lines */}
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 400 400"
                style={{ zIndex: 0 }}
              >
                {curriculumAreas.map((area, index) => {
                  const angle = (index * 60 - 90) * (Math.PI / 180);
                  const centerX = 200;
                  const centerY = 200;
                  const innerRadius = 70;
                  const outerRadius = 130;
                  
                  const x1 = centerX + Math.cos(angle) * innerRadius;
                  const y1 = centerY + Math.sin(angle) * innerRadius;
                  const x2 = centerX + Math.cos(angle) * outerRadius;
                  const y2 = centerY + Math.sin(angle) * outerRadius;
                  
                  const isActive = activeArea === area.id;
                  
                  return (
                    <line
                      key={index}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      className={cn(
                        "transition-all duration-300",
                        isActive 
                          ? "stroke-primary" 
                          : "stroke-primary/40"
                      )}
                      strokeWidth={isActive ? 3 : 2}
                      style={{
                        filter: isActive ? "drop-shadow(0 0 4px rgba(236,72,153,0.5))" : "none"
                      }}
                    />
                  );
                })}
              </svg>

              {/* Center Circle - Curriculum Icon with breathing animation */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 dark:from-pink-500 dark:via-pink-600 dark:to-pink-700 flex items-center justify-center shadow-[0_6px_0_0_rgb(157,23,77),0_8px_20px_-2px_rgba(219,39,119,0.5)] dark:shadow-[0_6px_0_0_rgb(131,24,67),0_8px_20px_-2px_rgba(219,39,119,0.35)] z-10 motion-safe:animate-breathe"
              >
                <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={1.5} />
              </div>

              {/* Curriculum Area Bubbles with floating animation and tooltips */}
              {curriculumAreas.map((area, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const radius = 145;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const Icon = area.icon;
                const isActive = activeArea === area.id;
                
                return (
                  <Tooltip key={area.id}>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "absolute top-1/2 left-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer motion-safe:animate-float focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full",
                          isActive && "z-30"
                        )}
                        style={{
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                          animationDelay: `${index * 0.3}s`,
                        }}
                        onClick={() => setActiveArea(isActive ? null : area.id)}
                        data-testid={`curriculum-area-${area.id}`}
                        aria-label={`${area.label}: ${area.benefit}`}
                      >
                        <div className={cn(
                          "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-200",
                          area.bg,
                          area.shadow,
                          isActive 
                            ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-background" 
                            : "hover:scale-105"
                        )}>
                          <Icon className={cn("w-6 h-6 md:w-7 md:h-7", area.iconColor)} />
                        </div>
                        <span className={cn(
                          "text-xs md:text-sm font-semibold text-center whitespace-nowrap transition-colors duration-200",
                          isActive ? "text-primary" : "text-foreground"
                        )}>
                          {area.label}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px]">
                      <p className="font-semibold">{area.label}</p>
                      <p className="text-xs text-muted-foreground">{area.benefit}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations with reduced motion support */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.03); }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(calc(-50% + var(--x, 0px)), calc(-50% + var(--y, 0px))); }
          50% { transform: translate(calc(-50% + var(--x, 0px)), calc(-50% + var(--y, 0px) - 6px)); }
        }
        
        .motion-safe\\:animate-breathe {
          animation: breathe 5s ease-in-out infinite;
        }
        
        .motion-safe\\:animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-breathe,
          .motion-safe\\:animate-float,
          .motion-safe\\:animate-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
