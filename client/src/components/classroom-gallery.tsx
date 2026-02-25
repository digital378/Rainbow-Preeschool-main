import { useState, useRef, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const galleryImages = [
  {
    src: "/images/campus/campus-nature-room.webp",
    alt: "Nature Room at Rainbow Preschool Thane",
    category: "Nature Room"
  },
  {
    src: "/images/campus/campus-reading-room.webp",
    alt: "Reading Room at Rainbow Preschool",
    category: "Reading Room"
  },
  {
    src: "/images/optimized/classroom-kids-playing.webp",
    alt: "Preschoolers playing with colorful letters at Rainbow Preschool Thane",
    category: "Preschoolers"
  },
  {
    src: "/images/optimized/DSC00051.webp",
    alt: "Preschoolers in bright colorful classroom at Rainbow Preschool Thane",
    category: "Preschoolers"
  },
  {
    src: "/images/optimized/DSC00054.webp",
    alt: "Preschoolers enjoying learning activities at Rainbow Preschool",
    category: "Preschoolers"
  },
  {
    src: "/images/campus/campus-space-room.webp",
    alt: "Space Room at Rainbow Preschool Thane",
    category: "Space Room"
  },
];

function MobileCarousel() {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = galleryImages.length;

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 2500);
  }, [total]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  const handleTouchStart = (e: React.TouchEvent) => {
    stopAutoplay();
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setTranslateX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 50;
    if (translateX < -threshold) {
      setCurrent((prev) => (prev + 1) % total);
    } else if (translateX > threshold) {
      setCurrent((prev) => (prev - 1 + total) % total);
    }
    setTranslateX(0);
    startAutoplay();
  };

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      <div
        className="flex"
        style={{
          transform: `translateX(calc(-${current * 85}% + ${translateX}px))`,
          transition: isDragging ? 'none' : 'transform 0.5s ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        data-testid="mobile-gallery-carousel"
      >
        {galleryImages.map((image, index) => {
          const isActive = index === current;
          return (
            <div
              key={index}
              className="flex-shrink-0 px-1.5"
              style={{ width: '85%' }}
            >
              <div
                className={cn(
                  "relative rounded-2xl overflow-hidden transition-all duration-500",
                  isActive ? "shadow-xl scale-100" : "shadow-md scale-[0.94] opacity-75"
                )}
              >
                <div className="aspect-[4/3]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                    data-testid={`img-mobile-gallery-${index + 1}`}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                  <span className="inline-block px-2.5 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
                    {image.category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrent(index); stopAutoplay(); startAutoplay(); }}
            className={cn(
              "rounded-full transition-all duration-300",
              index === current
                ? "w-6 h-2 bg-primary"
                : "w-2 h-2 bg-primary/30"
            )}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopGrid() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {galleryImages.map((image, index) => (
          <Card
            key={index}
            className={cn(
              "overflow-hidden cursor-pointer group relative",
              index === 0 && "col-span-2 row-span-2"
            )}
            onClick={() => setSelectedImage(image.src)}
            data-testid={`gallery-image-${index}`}
          >
            <div className={cn(
              "relative overflow-hidden",
              index === 0 ? "aspect-auto h-full" : "aspect-square"
            )}>
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                width={400}
                height={400}
                data-testid={`img-home-gallery-${index + 1}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-2 py-1 bg-primary/90 text-primary-foreground text-xs rounded-full">
                  {image.category}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-0">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Enlarged view of preschool activity"
              className="w-full h-auto rounded-lg"
              width={800}
              height={600}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ClassroomGallery() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12" data-reveal="float">
          <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Life at Rainbow</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-sparkle>Glimpses of Joy at Our Preschool</h2>
          <p className="text-muted-foreground text-lg">
            See our little learners explore, play, and grow in our safe and nurturing classrooms across Thane.
          </p>
        </div>

        <div className="md:hidden">
          <MobileCarousel />
        </div>

        <div className="hidden md:block">
          <DesktopGrid />
        </div>
      </div>
    </section>
  );
}
