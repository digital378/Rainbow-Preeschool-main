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

const colorMap: Record<string, string> = {
  playgroup: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  nursery: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  kindergarten: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  "kids-activity-club": "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  "summer-camp": "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  daycare: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
};

interface ProgrammeCardProps {
  programme: Programme;
  index?: number;
}

export function ProgrammeCard({ programme, index = 0 }: ProgrammeCardProps) {
  const Icon = iconMap[programme.icon as keyof typeof iconMap] || Baby;
  const colorClass = colorMap[programme.id] || colorMap.playgroup;

  return (
    <Link href={`/programmes#${programme.id}`}>
      <Card 
        className="group h-full transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
        data-testid={`card-programme-${programme.id}`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", colorClass)}>
              <Icon className="w-6 h-6" />
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
