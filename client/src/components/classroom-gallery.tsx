import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Note: These images must be different from programme card images on the same page
const galleryImages = [
  {
    src: "/images/optimized/DSC00002.webp",
    alt: "Children learning at Rainbow Preschool Thane",
    category: "Learning"
  },
  {
    src: "/images/optimized/DSC00011.webp",
    alt: "Children playing at Rainbow Preschool",
    category: "Play"
  },
  {
    src: "/images/optimized/classroom-rainbow-preschool.webp",
    alt: "Bright and colorful classroom at Rainbow Preschool Thane",
    category: "Classroom"
  },
  {
    src: "/images/optimized/DSC00051.webp",
    alt: "Bright colorful classroom at Rainbow Preschool Thane",
    category: "Classroom"
  },
  {
    src: "/images/optimized/DSC00054.webp",
    alt: "Fun learning activities at preschool",
    category: "Learning"
  },
  {
    src: "/images/optimized/DSC00147.webp",
    alt: "Children enjoying ball pit activities at Rainbow Preschool",
    category: "Fun"
  },
];

export function ClassroomGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {galleryImages.map((image, index) => (
            <Card
              key={index}
              className={cn(
                "overflow-hidden cursor-pointer group relative",
                index === 0 && "md:col-span-2 md:row-span-2"
              )}
              onClick={() => setSelectedImage(image.src)}
              data-testid={`gallery-image-${index}`}
            >
              <div className={cn(
                "relative overflow-hidden",
                index === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-square"
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
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-2 py-1 bg-primary/90 text-primary-foreground text-xs rounded-full">
                    {image.category}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
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
    </section>
  );
}
