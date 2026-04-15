import { Link } from "wouter";
import { Star, BookOpen, Heart, GraduationCap, Search, Baby } from "lucide-react";

const seoPages = [
  { href: "/best-preschool-near-me-in-thane", label: "Best Preschool in Thane", icon: Star, desc: "Top-rated since 2007" },
  { href: "/play-school-near-me", label: "Play School Near Me", icon: Baby, desc: "Ages 1.5–2.5 years" },
  { href: "/nursery", label: "Nursery Programme", icon: BookOpen, desc: "Ages 2.5–4 years" },
  { href: "/preschool-admissions", label: "Admissions 2026-27", icon: GraduationCap, desc: "Enquire now" },
  { href: "/top-preschools-in-thane", label: "Top Preschools in Thane", icon: Search, desc: "Compare top 10" },
  { href: "/preschool-readiness-quiz", label: "Readiness Quiz", icon: Heart, desc: "Is your child ready?" },
];

interface SEOCrossLinksProps {
  currentPath: string;
  title?: string;
}

export function SEOCrossLinks({ currentPath, title = "Parents Also Search For" }: SEOCrossLinksProps) {
  const filtered = seoPages.filter((p) => p.href !== currentPath);

  return (
    <section className="py-8 md:py-10 px-4 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {filtered.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center hover:border-primary transition-colors"
              data-testid={`link-crosslink-${page.href.slice(1)}`}
            >
              <page.icon className="w-4 h-4 text-primary mx-auto mb-1" />
              <span className="font-medium text-gray-900 dark:text-white text-sm block">{page.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{page.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
