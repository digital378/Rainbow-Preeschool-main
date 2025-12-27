import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Baby, BookOpen, GraduationCap, Palette, Sun, Heart } from "lucide-react";
import { type Programme } from "@shared/schema";
import { cn } from "@/lib/utils";

const iconMap = {
  baby: Baby,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  palette: Palette,
  sun: Sun,
  heart: Heart,
};

const colorMap: Record<string, { bg: string; icon: string; shadow: string }> = {
  playgroup: {
    bg: "bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800/40 dark:to-pink-900/40",
    icon: "text-pink-600 dark:text-pink-400",
    shadow: "shadow-[0_4px_0_0_rgb(219,39,119),0_6px_12px_-2px_rgba(219,39,119,0.3)] dark:shadow-[0_4px_0_0_rgb(157,23,77),0_6px_12px_-2px_rgba(219,39,119,0.2)]"
  },
  nursery: {
    bg: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800/40 dark:to-blue-900/40",
    icon: "text-blue-600 dark:text-blue-400",
    shadow: "shadow-[0_4px_0_0_rgb(37,99,235),0_6px_12px_-2px_rgba(37,99,235,0.3)] dark:shadow-[0_4px_0_0_rgb(30,64,175),0_6px_12px_-2px_rgba(37,99,235,0.2)]"
  },
  kindergarten: {
    bg: "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800/40 dark:to-green-900/40",
    icon: "text-green-600 dark:text-green-400",
    shadow: "shadow-[0_4px_0_0_rgb(22,163,74),0_6px_12px_-2px_rgba(22,163,74,0.3)] dark:shadow-[0_4px_0_0_rgb(21,128,61),0_6px_12px_-2px_rgba(22,163,74,0.2)]"
  },
  "kids-activity-club": {
    bg: "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800/40 dark:to-purple-900/40",
    icon: "text-purple-600 dark:text-purple-400",
    shadow: "shadow-[0_4px_0_0_rgb(147,51,234),0_6px_12px_-2px_rgba(147,51,234,0.3)] dark:shadow-[0_4px_0_0_rgb(107,33,168),0_6px_12px_-2px_rgba(147,51,234,0.2)]"
  },
  "summer-camp": {
    bg: "bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800/40 dark:to-orange-900/40",
    icon: "text-orange-600 dark:text-orange-400",
    shadow: "shadow-[0_4px_0_0_rgb(234,88,12),0_6px_12px_-2px_rgba(234,88,12,0.3)] dark:shadow-[0_4px_0_0_rgb(194,65,12),0_6px_12px_-2px_rgba(234,88,12,0.2)]"
  },
  daycare: {
    bg: "bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-800/40 dark:to-rose-900/40",
    icon: "text-rose-600 dark:text-rose-400",
    shadow: "shadow-[0_4px_0_0_rgb(225,29,72),0_6px_12px_-2px_rgba(225,29,72,0.3)] dark:shadow-[0_4px_0_0_rgb(159,18,57),0_6px_12px_-2px_rgba(225,29,72,0.2)]"
  },
};

const defaultColor = colorMap.playgroup;

interface ProgrammeCardProps {
  programme: Programme;
  index?: number;
}

export function ProgrammeCard({ programme, index = 0 }: ProgrammeCardProps) {
  const Icon = iconMap[programme.icon as keyof typeof iconMap] || Baby;
  const colors = colorMap[programme.id] || defaultColor;

  const programmeRoutes: Record<string, string> = {
    playgroup: "/playgroup",
    nursery: "/nursery",
    kindergarten: "/kindergarten",
    "kids-activity-club": "/kids-activity-club",
    "summer-camp": "/summer-camp",
    "happy-times": "/happy-times",
  };
  
  const href = programmeRoutes[programme.id] || `/programmes#${programme.id}`;

  return (
    <Link href={href}>
      <Card 
        className="group h-full transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
        data-testid={`card-programme-${programme.id}`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:translate-y-0.5 group-hover:shadow-none",
              colors.bg,
              colors.shadow
            )}>
              <Icon className={cn("w-6 h-6", colors.icon)} />
            </div>
            <Badge variant="secondary" className="text-xs">
              {programme.ageRange}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {programme.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {programme.description}
          </p>
          <div className="flex items-center gap-1 text-sm font-medium text-primary pt-2">
            Learn More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
