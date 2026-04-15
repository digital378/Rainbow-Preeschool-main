import { Link } from "wouter";
import { LOCATION_LINK_MAP } from "@shared/seo-config";
import { FileText, MapPin, Award, Palette, BookOpen, GraduationCap, ChevronRight, Search, ClipboardCheck, BarChart3 } from "lucide-react";

interface BlogInternalLinksProps {
  currentSlug?: string;
}

export function BlogInternalLinks({ currentSlug = "" }: BlogInternalLinksProps) {
  const getLocationLink = () => {
    for (const [keyword, url] of Object.entries(LOCATION_LINK_MAP)) {
      if (currentSlug.includes(keyword)) {
        return { keyword, url };
      }
    }
    return null;
  };

  const locationLink = getLocationLink();

  return (
    <div className="mt-12 p-6 bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl border border-red-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Explore Rainbow Preschool
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
        <Link 
          href="/preschool-admissions"
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          data-testid="link-blog-admissions"
        >
          <FileText className="w-4 h-4 text-primary flex-shrink-0" />
          Preschool Admissions
        </Link>
        
        <Link 
          href="/play-school-near-me"
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          data-testid="link-blog-near-me"
        >
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          Find Preschool Near You
        </Link>
        
        <Link 
          href="/best-preschool-near-me-in-thane"
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          data-testid="link-blog-best-preschool"
        >
          <Award className="w-4 h-4 text-primary flex-shrink-0" />
          Best Preschool in Thane
        </Link>
        
        <Link 
          href="/play-school-near-me"
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-cyan-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          data-testid="link-blog-play-school-near-me"
        >
          <Search className="w-4 h-4 text-cyan-600 flex-shrink-0" />
          Play School Near Me
        </Link>
        
        <Link 
          href="/playgroup"
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          data-testid="link-blog-playgroup"
        >
          <Palette className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          Playgroup Programme
        </Link>
        
        <Link 
          href="/nursery"
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          data-testid="link-blog-nursery"
        >
          <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
          Nursery Programme
        </Link>
        
        <Link 
          href="/kindergarten"
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          data-testid="link-blog-kindergarten"
        >
          <GraduationCap className="w-4 h-4 text-green-500 flex-shrink-0" />
          Kindergarten Programme
        </Link>
        
        <Link 
          href="/top-preschools-in-thane"
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          data-testid="link-blog-top-preschools"
        >
          <BarChart3 className="w-4 h-4 text-orange-500 flex-shrink-0" />
          Top 10 Preschools in Thane
        </Link>
        
        <Link 
          href="/preschool-readiness-quiz"
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          data-testid="link-blog-readiness-quiz"
        >
          <ClipboardCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          Readiness Quiz
        </Link>
      </div>
      
      {locationLink && (
        <div className="mt-4 pt-4 border-t border-red-100">
          <Link 
            href={locationLink.url}
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
            data-testid="link-blog-location"
          >
            <MapPin className="w-4 h-4" />
            Visit Our {locationLink.keyword.charAt(0).toUpperCase() + locationLink.keyword.slice(1).replace("-", " ")} Centre
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
      
      <p className="mt-4 text-xs text-gray-500">
        Rainbow Preschool International - Trusted by 1,00,000+ families since 2007
      </p>
    </div>
  );
}
