import { useState, useEffect, useCallback, useRef } from "react";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { X, ChevronLeft, ChevronRight, Images, Award, MapPin, ClipboardList, BookOpen } from "lucide-react";
import {
  GALLERY_CATEGORIES,
  GALLERY_IMAGES,
  GALLERY_CTA,
  GALLERY_SEO_CONTENT,
  type GalleryCategoryId,
  type GalleryImage,
} from "@/lib/gallery-config";

function gtag(...args: any[]) {
  if ((window as any).gtag) (window as any).gtag(...args);
}

function trackEvent(eventName: string, params?: Record<string, any>) {
  if ((window as any).gtag) (window as any).gtag("event", eventName, params ?? {});
}

// ── Lightbox ────────────────────────────────────────────────────────────────

interface LightboxProps {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const img = images[index];
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? onNext() : onPrev();
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
        onClick={onClose}
        data-testid="button-lightbox-close"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          className="absolute left-3 md:left-6 z-10 text-white/80 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          data-testid="button-lightbox-prev"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}

      {/* Image */}
      <div
        className="max-w-5xl max-h-[90vh] mx-12 md:mx-20 flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.alt}
          className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
          loading="eager"
        />
        <div className="text-center">
          {img.caption && (
            <p className="text-white/90 text-sm font-medium">{img.caption}</p>
          )}
          <p className="text-white/50 text-xs mt-0.5">
            {index + 1} / {images.length}
          </p>
        </div>
      </div>

      {/* Next */}
      {index < images.length - 1 && (
        <button
          className="absolute right-3 md:right-6 z-10 text-white/80 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          data-testid="button-lightbox-next"
          aria-label="Next image"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}

// ── Gallery Page ─────────────────────────────────────────────────────────────

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategoryId>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  const filteredImages =
    activeCategory === "all"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  const handleFilterClick = (id: GalleryCategoryId) => {
    setActiveCategory(id);
    trackEvent("gallery_filter_click", { filter: id });
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    trackEvent("lightbox_open", {
      image_id: filteredImages[index].id,
      category: filteredImages[index].category,
    });
    trackEvent("image_click", { image_id: filteredImages[index].id });
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  }, []);
  const nextImage = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null && i < filteredImages.length - 1 ? i + 1 : i
    );
  }, [filteredImages.length]);

  // Scroll active filter into view
  useEffect(() => {
    if (!filterBarRef.current) return;
    const active = filterBarRef.current.querySelector("[data-active='true']") as HTMLElement;
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <SEO
        title="School Gallery | Rainbow Preschool International Thane"
        description="Explore classrooms, activities, events, and facilities across Rainbow Preschool's 6 centres in Thane. 18+ years of joyful early childhood education trusted by 1,00,000+ families."
        keywords="rainbow preschool gallery, preschool photos thane, preschool classroom photos, kids activity photos thane, preschool facilities thane"
        canonical="https://www.rainbowpreschools.com/gallery"
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="pt-28 pb-10 md:pt-32 md:pb-12 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Images className="w-4 h-4" />
            Life at Rainbow Preschools
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Gallery
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our classrooms, activities, events, and joyful learning moments across our 6 centres in Thane.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {GALLERY_IMAGES.length} photos &nbsp;·&nbsp; {GALLERY_CATEGORIES.length - 1} categories
          </p>
        </div>

        {/* Animated image strip */}
        <div className="mt-8 overflow-hidden">
          <div
            className="flex gap-3 animate-marquee"
            style={{ width: "max-content" }}
          >
            {[...GALLERY_IMAGES.slice(0, 10), ...GALLERY_IMAGES.slice(0, 10)].map((img, i) => (
              <div key={i} className="w-28 h-20 md:w-36 md:h-24 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sticky Filter Bar ────────────────────────────────────── */}
      <div className="sticky top-[80px] md:top-[96px] z-30 bg-white/95 dark:bg-background/95 backdrop-blur-md border-b shadow-sm">
        <div
          ref={filterBarRef}
          className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide"
        >
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count =
              cat.id === "all"
                ? GALLERY_IMAGES.length
                : GALLERY_IMAGES.filter((img) => img.category === cat.id).length;
            return (
              <button
                key={cat.id}
                data-active={isActive}
                data-testid={`filter-${cat.id}`}
                onClick={() => handleFilterClick(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-white shadow-md scale-105"
                    : "bg-gray-100 dark:bg-muted text-muted-foreground hover:bg-gray-200 dark:hover:bg-muted/70"
                }`}
              >
                {cat.label}
                <span className={`ml-1.5 text-xs ${isActive ? "text-white/80" : "text-muted-foreground"}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Masonry Grid ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <p className="text-sm text-muted-foreground mb-6">
          Showing <strong>{filteredImages.length}</strong> photos
          {activeCategory !== "all" && (
            <> in <strong>{GALLERY_CATEGORIES.find((c) => c.id === activeCategory)?.label}</strong></>
          )}
        </p>

        {filteredImages.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No images in this category yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredImages.map((img, i) => (
              <div
                key={img.id}
                className="aspect-[4/3] group relative cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                onClick={() => openLightbox(i)}
                data-testid={`gallery-image-${img.id}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  {img.caption && (
                    <p className="text-white text-xs font-medium leading-snug">{img.caption}</p>
                  )}
                  <span className="text-white/70 text-[10px] mt-0.5 capitalize">
                    {GALLERY_CATEGORIES.find((c) => c.id === img.category)?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── SEO Content Block ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="bg-gray-50 dark:bg-muted/30 rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            About Rainbow Preschools — Thane's Most Trusted Preschool
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{GALLERY_SEO_CONTENT}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { label: "Playgroup",    href: "/playgroup" },
              { label: "Nursery",      href: "/nursery" },
              { label: "Kindergarten", href: "/kindergarten" },
              { label: "Happy Times",  href: "/happy-times" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 font-medium hover:bg-primary/20 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">Explore Rainbow Preschool</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/best-preschool-near-me-in-thane" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-gallery-best-preschool">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Award-Winning Preschool</span>
            </Link>
            <Link href="/preschool-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-gallery-near-me">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Find Nearest Centre</span>
            </Link>
            <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-gallery-admissions">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Admission Process</span>
            </Link>
            <Link href="/programmes" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-gallery-programmes">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Our Programmes</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {GALLERY_CTA.heading}
          </h2>
          <p className="text-white/80 text-base mb-8">{GALLERY_CTA.subtext}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={GALLERY_CTA.primaryBtn.href}>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 font-semibold rounded-full px-8"
                data-testid="button-gallery-cta-visit"
                onClick={() => trackEvent("CTA_click", { label: "Book a Visit", page: "gallery" })}
              >
                {GALLERY_CTA.primaryBtn.label}
              </Button>
            </Link>
            <Link href={GALLERY_CTA.secondaryBtn.href}>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold rounded-full px-8"
                data-testid="button-gallery-cta-enquire"
                onClick={() => trackEvent("CTA_click", { label: "Enquire Now", page: "gallery" })}
              >
                {GALLERY_CTA.secondaryBtn.label}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
}
