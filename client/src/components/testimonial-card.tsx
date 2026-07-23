import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { type Testimonial } from "@shared/schema";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "h-full flex flex-col rounded-xl",
        "bg-white dark:bg-card border border-card-border",
        "shadow-card hover:shadow-card-hover",
        "transition-all duration-[250ms] hover:-translate-y-1",
        "p-5 sm:p-6"
      )}
      data-testid={`card-testimonial-${testimonial.id}`}
    >
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-4 h-4",
              i < testimonial.rating
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>

      {/* Decorative opening quote */}
      <div
        className="font-serif text-5xl leading-none text-primary/15 dark:text-primary/20 select-none mb-1"
        aria-hidden="true"
      >
        &ldquo;
      </div>

      {/* Quote */}
      <blockquote className="flex-1 text-sm text-foreground/80 leading-relaxed line-clamp-4 mb-5">
        {testimonial.text}
      </blockquote>

      {/* Divider */}
      <div className="w-full h-px bg-border mb-4" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9 ring-2 ring-primary/15 ring-offset-1">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Parent · {testimonial.locality}</p>
        </div>
      </div>
    </div>
  );
}
