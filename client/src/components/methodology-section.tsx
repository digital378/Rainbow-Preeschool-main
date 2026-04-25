import { Link } from "wouter";
import { Button } from "@/components/ui/button";
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
    angle: -90,
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
    angle: -30,
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
    angle: 30,
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
    angle: 90,
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
    angle: 150,
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
    angle: 210,
    bg: "bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600",
    iconColor: "text-white",
    shadow: "shadow-[0_4px_0_0_rgb(180,83,9),0_6px_12px_-2px_rgba(245,158,11,0.4)]",
  },
];

function getLabelPosition(angleDeg: number): { 
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'center' | 'bottom';
} {
  const normalizedAngle = ((angleDeg % 360) + 360) % 360;
  
  let horizontal: 'left' | 'center' | 'right' = 'center';
  let vertical: 'top' | 'center' | 'bottom' = 'center';
  
  if (normalizedAngle > 45 && normalizedAngle < 135) {
    horizontal = 'right';
  } else if (normalizedAngle > 225 && normalizedAngle < 315) {
    horizontal = 'left';
  }
  
  if (normalizedAngle >= 315 || normalizedAngle <= 45) {
    vertical = 'top';
  } else if (normalizedAngle >= 135 && normalizedAngle <= 225) {
    vertical = 'bottom';
  }
  
  return { horizontal, vertical };
}

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

  const orbitRadius = 140;
  const hubSize = 112;
  const satelliteSize = 48;

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-20 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content - Left column */}
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
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6 pb-4 relative inline-block"
              style={{ lineHeight: "1.15" }}
            >
              Research-Based Curriculum for Every Child
              <span 
                className="absolute left-0 h-1.5 md:h-2 w-full rounded-full bg-gradient-to-r from-primary via-red-400 to-secondary"
                style={{ bottom: "0.5rem" }}
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

          {/* Orbit Diagram - Right column */}
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
            {/* Orbit container with fixed dimensions */}
            <div 
              className="orbit relative"
              style={{ 
                width: "clamp(300px, 80vw, 400px)", 
                height: "clamp(300px, 80vw, 400px)" 
              }}
            >
              {/* SVG connecting lines - z-index 1 */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                viewBox="0 0 400 400"
                style={{ zIndex: 1 }}
                aria-hidden="true"
              >
                {curriculumAreas.map((area, index) => {
                  const angleRad = area.angle * (Math.PI / 180);
                  const centerX = 200;
                  const centerY = 200;
                  const innerRadius = 56;
                  const outerRadius = 140;
                  
                  const x1 = centerX + Math.cos(angleRad) * innerRadius;
                  const y1 = centerY + Math.sin(angleRad) * innerRadius;
                  const x2 = centerX + Math.cos(angleRad) * outerRadius;
                  const y2 = centerY + Math.sin(angleRad) * outerRadius;
                  
                  const isActive = activeArea === area.id;
                  
                  return (
                    <line
                      key={area.id}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      className={cn(
                        "transition-all duration-300",
                        isActive ? "stroke-primary" : "stroke-primary/30"
                      )}
                      strokeWidth={isActive ? 3 : 2}
                    />
                  );
                })}
              </svg>

              {/* Center Hub - z-index 2 (ONLY icon, no labels) */}
              <div 
                className="orbit__hub absolute rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 dark:from-red-500 dark:via-red-600 dark:to-red-700 flex items-center justify-center shadow-[0_6px_0_0_rgb(153,27,27),0_8px_20px_-2px_rgba(220,38,38,0.5)] dark:shadow-[0_6px_0_0_rgb(127,29,29),0_8px_20px_-2px_rgba(220,38,38,0.35)]"
                style={{
                  width: "clamp(100px, 25vw, 144px)",
                  height: "clamp(100px, 25vw, 144px)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                }}
              >
                <BookOpen 
                  className="text-white" 
                  style={{ width: "clamp(40px, 10vw, 64px)", height: "clamp(40px, 10vw, 64px)" }}
                  strokeWidth={1.5} 
                />
              </div>

              {/* Satellite buttons with labels - z-index 3 */}
              {curriculumAreas.map((area) => {
                const angleRad = area.angle * (Math.PI / 180);
                const x = Math.cos(angleRad) * orbitRadius;
                const y = Math.sin(angleRad) * orbitRadius;
                const Icon = area.icon;
                const isActive = activeArea === area.id;
                const labelPos = getLabelPosition(area.angle);
                
                let labelStyle: React.CSSProperties = {
                  position: 'absolute',
                  whiteSpace: 'nowrap',
                  fontSize: 'clamp(10px, 2.5vw, 13px)',
                  fontWeight: 600,
                  pointerEvents: 'none',
                };
                
                if (labelPos.vertical === 'top') {
                  labelStyle.top = '-24px';
                  labelStyle.left = '50%';
                  labelStyle.transform = 'translateX(-50%)';
                } else if (labelPos.vertical === 'bottom') {
                  labelStyle.bottom = '-24px';
                  labelStyle.left = '50%';
                  labelStyle.transform = 'translateX(-50%)';
                } else if (labelPos.horizontal === 'right') {
                  labelStyle.left = 'calc(100% + 8px)';
                  labelStyle.top = '50%';
                  labelStyle.transform = 'translateY(-50%)';
                } else if (labelPos.horizontal === 'left') {
                  labelStyle.right = 'calc(100% + 8px)';
                  labelStyle.top = '50%';
                  labelStyle.transform = 'translateY(-50%)';
                } else {
                  labelStyle.bottom = '-24px';
                  labelStyle.left = '50%';
                  labelStyle.transform = 'translateX(-50%)';
                }
                
                return (
                  <Tooltip key={area.id}>
                    <TooltipTrigger asChild>
                      <button
                        className="orbit__satellite absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full"
                        style={{
                          width: "clamp(44px, 12vw, 56px)",
                          height: "clamp(44px, 12vw, 56px)",
                          top: "50%",
                          left: "50%",
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                          zIndex: 3,
                        }}
                        onClick={() => setActiveArea(isActive ? null : area.id)}
                        data-testid={`curriculum-area-${area.id}`}
                        aria-label={`${area.label}: ${area.benefit}`}
                      >
                        {/* Satellite icon */}
                        <div className={cn(
                          "w-full h-full rounded-full flex items-center justify-center transition-all duration-200",
                          area.bg,
                          area.shadow,
                          isActive 
                            ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-background" 
                            : "hover:scale-105"
                        )}>
                          <Icon className={cn(area.iconColor)} style={{ width: "clamp(20px, 5vw, 28px)", height: "clamp(20px, 5vw, 28px)" }} />
                        </div>
                        
                        {/* Satellite label - positioned OUTSIDE */}
                        <span 
                          className={cn(
                            "orbit__label transition-colors duration-200",
                            isActive ? "text-primary" : "text-foreground"
                          )}
                          style={labelStyle}
                        >
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
    </section>
  );
}
