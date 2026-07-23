import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { type Programme } from "@shared/schema";
import { cn } from "@/lib/utils";

const badgeColorMap: Record<string, string> = {
  playgroup:          "bg-red-500 text-white",
  nursery:            "bg-blue-500 text-white",
  kindergarten:       "bg-emerald-500 text-white",
  "kids-activity-club": "bg-violet-500 text-white",
  "summer-camp":      "bg-orange-500 text-white",
  "happy-times":      "bg-rose-500 text-white",
};

interface ProgrammeCardProps {
  programme: Programme;
  index?: number;
}

export function ProgrammeCard({ programme, index = 0 }: ProgrammeCardProps) {
  const badgeColor = badgeColorMap[programme.id] || badgeColorMap.playgroup;

  const programmeRoutes: Record<string, string> = {
    playgroup:          "/playgroup",
    nursery:            "/nursery",
    kindergarten:       "/kindergarten",
    "kids-activity-club": "/programmes",
    "summer-camp":      "/programmes",
    "happy-times":      "/happy-times",
  };

  const href = programmeRoutes[programme.id] || `/programmes#${programme.id}`;

  return (
    <Link href={href}>
      {/* Premium card: rounded-xl (20px), real shadow, hover lift */}
      <div
        className={cn(
          "group h-full cursor-pointer overflow-hidden rounded-xl",
          "bg-white dark:bg-card border border-card-border",
          "shadow-card hover:shadow-card-hover",
          "transition-all duration-[250ms]",
          "hover:-translate-y-2"
        )}
        data-testid={`card-programme-${programme.id}`}
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={programme.image}
              alt={`${programme.name} activities at Rainbow Preschool`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              width={400}
              height={300}
              data-testid={`img-programme-card-${programme.id}`}
            />
          </div>
          {/* Subtle hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Age badge */}
          <Badge
            className={cn(
              "absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm border-0",
              badgeColor,
              "no-default-hover-elevate no-default-active-elevate"
            )}
          >
            {programme.ageRange}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-5 space-y-2.5">
          <h3 className="font-heading font-semibold text-base text-foreground group-hover:text-primary transition-colors duration-[150ms]" style={{ letterSpacing: "-0.01em" }}>
            {programme.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {programme.description}
          </p>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-primary pt-1.5">
            Learn More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-[150ms]" aria-hidden />
          </div>
        </div>
      </div>
    </Link>
  );
}
