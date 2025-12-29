import { useRef, useEffect, useState } from "react";
import { Heart, Sparkles, Palette, Music, BookOpen, Users, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  sparkles: Sparkles,
  palette: Palette,
  music: Music,
  book: BookOpen,
  users: Users,
};

interface TimelineItem {
  time: string;
  label: string;
  activity: string;
  icon: string;
}

interface DayTimelineProps {
  items: TimelineItem[];
}

export function DayTimeline({ items }: DayTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">A Day in Our Playgroup</h2>
          <p className="text-muted-foreground">Fun-filled learning activities designed for toddlers</p>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden space-y-4">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Heart;
            return (
              <div
                key={item.label}
                className={`flex gap-4 transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  {index < items.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-xs text-muted-foreground mb-0.5">{item.time}</p>
                  <h3 className="font-semibold">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.activity}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Heart;
            return (
              <div
                key={item.label}
                className={`text-center p-6 rounded-xl bg-muted/30 transition-all duration-500 hover-elevate ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-7 h-7 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">{item.time}</p>
                <h3 className="font-semibold mb-1">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.activity}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
