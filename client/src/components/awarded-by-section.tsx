const awardLogos = [
  { name: "India Today", displayName: "INDIA TODAY", color: "text-red-600" },
  { name: "Award Shield", displayName: "Excellence Award", color: "text-amber-600" },
  { name: "Scoo News", displayName: "SCOO NEWS", color: "text-gray-800 dark:text-gray-200" },
  { name: "World Education Summit", displayName: "World Education Summit", color: "text-blue-700 dark:text-blue-400" },
  { name: "Economic Times", displayName: "ET", color: "text-gray-900 dark:text-gray-100" },
  { name: "NSA Award", displayName: "NSA 2023", color: "text-amber-500" },
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
              <div className="px-4 md:px-8 py-2 flex items-center justify-center min-w-[100px] md:min-w-[140px]">
                <span className={`font-bold text-lg md:text-xl ${logo.color}`}>
                  {logo.displayName}
                </span>
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
