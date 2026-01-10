import indiaToday from "@assets/logos/india-today.png";
import scooNews from "@assets/logos/scoo-news.png";
import worldEducationSummit from "@assets/logos/world-education-summit.png";
import economicTimes from "@assets/logos/economic-times.png";
import nsaAward from "@assets/logos/nsa-award.png";
import awardShield from "@assets/logos/award-shield.png";

const awardLogos = [
  { name: "India Today", src: indiaToday, alt: "India Today Award" },
  { name: "Award Shield", src: awardShield, alt: "Excellence Award" },
  { name: "Scoo News", src: scooNews, alt: "Scoo News Recognition" },
  { name: "World Education Summit", src: worldEducationSummit, alt: "World Education Summit Mumbai" },
  { name: "Economic Times", src: economicTimes, alt: "Economic Times Feature" },
  { name: "NSA Award", src: nsaAward, alt: "National School Award 2023" },
];

export function AwardedBySection() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-foreground">
          Awarded By:
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-0">
          {awardLogos.map((logo, index) => (
            <div
              key={logo.name}
              className="flex items-center"
            >
              <div className="px-4 md:px-8 py-2 flex items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-12 md:h-16 lg:h-20 w-auto object-contain max-w-[120px] md:max-w-[150px] grayscale-0 dark:brightness-110"
                  loading="lazy"
                />
              </div>
              {index < awardLogos.length - 1 && (
                <div className="hidden md:block h-12 w-px bg-border/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
