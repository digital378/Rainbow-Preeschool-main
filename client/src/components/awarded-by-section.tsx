import indiaToday from "@assets/India_Today_1768032635727.png";
import thaneMunicipal from "@assets/Thane-Municipal-Cooperation-Logo_1768033856127.png";
import scooNewsLight from "@assets/Scoo_News_(For_Light_Mode)_1768032635727.png";
import scooNewsDark from "@assets/Scoo_News_(For_Dark_Mode)_1768032635727.png";
import worldEducationSummit from "@assets/15th_WES_Mumbai_1768032635726.png";
import economicTimes from "@assets/The_Economic_Times_1768032635728.png";
import nsaAward from "@assets/National_School_Awards_1768032635727.png";

interface AwardLogo {
  name: string;
  src: string;
  srcDark?: string;
  alt: string;
  url: string;
}

const awardLogos: AwardLogo[] = [
  { name: "India Today", src: indiaToday, alt: "India Today Award", url: "https://www.indiatoday.in" },
  { name: "Thane Municipal Corporation", src: thaneMunicipal, alt: "Thane Municipal Corporation Recognition", url: "https://thanecity.gov.in/tmc/CitizenHome.html" },
  { name: "Scoo News", src: scooNewsLight, srcDark: scooNewsDark, alt: "Scoo News Feature", url: "https://scoonews.com/" },
  { name: "World Education Summit", src: worldEducationSummit, alt: "15th World Education Summit Mumbai", url: "https://www.educationsummit.com/" },
  { name: "Economic Times", src: economicTimes, alt: "Economic Times Feature", url: "https://economictimes.indiatimes.com/" },
  { name: "NSA Award", src: nsaAward, alt: "National School Awards 2023", url: "http://nationalschoolawards.in/" },
];

function LogoImage({ logo }: { logo: AwardLogo }) {
  if (logo.srcDark) {
    return (
      <>
        <img
          src={logo.src}
          alt={logo.alt}
          className="h-10 md:h-16 lg:h-20 w-auto object-contain max-w-[100px] md:max-w-[150px] dark:hidden"
          loading="lazy"
        />
        <img
          src={logo.srcDark}
          alt={logo.alt}
          className="h-10 md:h-16 lg:h-20 w-auto object-contain max-w-[100px] md:max-w-[150px] hidden dark:block"
          loading="lazy"
        />
      </>
    );
  }
  return (
    <img
      src={logo.src}
      alt={logo.alt}
      className="h-10 md:h-16 lg:h-20 w-auto object-contain max-w-[100px] md:max-w-[150px]"
      loading="lazy"
    />
  );
}

export function AwardedBySection() {
  return (
    <section className="py-10 md:py-16 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-6 md:mb-12 text-foreground">
          Awarded By:
        </h2>
        
        {/* Mobile: Scrolling animation */}
        <div className="md:hidden relative">
          <div className="flex animate-scroll-rtl">
            {/* First set of logos */}
            {awardLogos.map((logo) => (
              <a
                key={logo.name}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-6 flex items-center justify-center hover:opacity-80 transition-opacity"
                data-testid={`link-award-${logo.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <LogoImage logo={logo} />
              </a>
            ))}
            {/* Duplicate set for seamless loop */}
            {awardLogos.map((logo) => (
              <a
                key={`${logo.name}-dup`}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-6 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <LogoImage logo={logo} />
              </a>
            ))}
          </div>
        </div>

        {/* Desktop: Static row with separators */}
        <div className="hidden md:flex justify-center items-center">
          {awardLogos.map((logo, index) => (
            <div
              key={logo.name}
              className="flex items-center"
            >
              <a 
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-2 flex items-center justify-center hover:opacity-80 transition-opacity"
                data-testid={`link-award-desktop-${logo.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <LogoImage logo={logo} />
              </a>
              {index < awardLogos.length - 1 && (
                <div className="h-12 w-px bg-border/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
