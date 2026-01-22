import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { type Programme } from "@shared/schema";

const badgeColorMap: Record<string, string> = {
  playgroup: "bg-pink-400 text-white no-default-hover-elevate no-default-active-elevate",
  nursery: "bg-blue-400 text-white no-default-hover-elevate no-default-active-elevate",
  kindergarten: "bg-green-400 text-white no-default-hover-elevate no-default-active-elevate",
  "kids-activity-club": "bg-purple-400 text-white no-default-hover-elevate no-default-active-elevate",
  "summer-camp": "bg-orange-400 text-white no-default-hover-elevate no-default-active-elevate",
  "happy-times": "bg-rose-400 text-white no-default-hover-elevate no-default-active-elevate",
};

interface ProgrammeCardProps {
  programme: Programme;
  index?: number;
}

export function ProgrammeCard({ programme, index = 0 }: ProgrammeCardProps) {
  const badgeColor = badgeColorMap[programme.id] || badgeColorMap.playgroup;

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
        className="group h-full transition-transform duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
        data-testid={`card-programme-${programme.id}`}
      >
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden">
            <img 
              src={programme.image} 
              alt={`${programme.name} activities at Rainbow Preschool`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              width={400}
              height={300}
              data-testid={`img-programme-card-${programme.id}`}
            />
          </div>
          <Badge 
            className={`absolute top-3 right-3 ${badgeColor} text-xs font-medium px-2 py-1 rounded-full`}
          >
            {programme.ageRange}
          </Badge>
        </div>
        <CardContent className="p-5 space-y-3">
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
