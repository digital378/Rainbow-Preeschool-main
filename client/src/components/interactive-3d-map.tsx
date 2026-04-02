import { useEffect, useState } from "react";
import { Navigation as NavigationIcon } from "lucide-react";

const centreMapPins = [
  { id: "kasarvadavali", label: "Kasarvadavali", mapUrl: "https://maps.app.goo.gl/9Bs1YpUM1cpBgiYA6", x: 25, y: 24, color: "#FFF3E0", roof: "#E53935", accent: "#FFC107" },
  { id: "anand-nagar", label: "Anand Nagar", mapUrl: "https://maps.app.goo.gl/XWTsinHiPU5EjH3HA", x: 62, y: 18, color: "#E3F2FD", roof: "#1E88E5", accent: "#42A5F5" },
  { id: "aggarwal", label: "Manpada", mapUrl: "https://maps.app.goo.gl/4sVVZ3K3x1MYsWFc7", x: 38, y: 44, color: "#FFF9C4", roof: "#F9A825", accent: "#FFD54F" },
  { id: "dhokali", label: "Dhokali", mapUrl: "https://maps.app.goo.gl/VFhUJXqVZRxKaeCWA", x: 65, y: 40, color: "#FCE4EC", roof: "#E53935", accent: "#EF9A9A" },
  { id: "hariniwas", label: "Hariniwas", mapUrl: "https://maps.app.goo.gl/NyiqKpYEiVsWoZdx5", x: 22, y: 72, color: "#E8F5E9", roof: "#43A047", accent: "#81C784" },
  { id: "kalwa", label: "Kalwa", mapUrl: "https://maps.app.goo.gl/riB8TNUQdJa9yiSY7", x: 80, y: 70, color: "#EDE7F6", roof: "#5E35B1", accent: "#9575CD" },
];

export function Interactive3DMap() {
  const [hoveredCentre, setHoveredCentre] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mb-12" data-testid="map-3d-centres">
      <style>{`
        @keyframes float-pin {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        @keyframes path-dash {
          to { stroke-dashoffset: -24; }
        }
        .map-pin-float { animation: float-pin 3s ease-in-out infinite; }
        .map-glow { animation: glow-pulse 2s ease-in-out infinite; }
        .map-path-animate { animation: path-dash 2s linear infinite; }
      `}</style>

      <div style={{ perspective: "1200px" }} className="w-full">
        <div
          className="relative w-full transition-all duration-1000 ease-out"
          style={{
            transform: loaded ? "rotateX(8deg) rotateY(-2deg)" : "rotateX(0deg) rotateY(0deg)",
            transformOrigin: "center 60%",
          }}
        >
          <div className="relative rounded-2xl shadow-2xl" style={{ overflow: "visible" }}>
            <svg viewBox="0 0 900 520" className="w-full h-auto block rounded-2xl" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="terrain-bg" x1="0" y1="0" x2="0.2" y2="1">
                  <stop offset="0%" stopColor="#E8F5E9" />
                  <stop offset="30%" stopColor="#C8E6C9" />
                  <stop offset="70%" stopColor="#A5D6A7" />
                  <stop offset="100%" stopColor="#81C784" />
                </linearGradient>
                <linearGradient id="terrain-edge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8D6E63" />
                  <stop offset="100%" stopColor="#5D4037" />
                </linearGradient>
                <filter id="terrain-shadow">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.2" />
                </filter>
                <filter id="building-shadow">
                  <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
                </filter>
                <filter id="tree-shadow">
                  <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2" />
                </filter>
                <radialGradient id="hill-1" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#A5D6A7" />
                  <stop offset="100%" stopColor="#C8E6C9" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="hill-2" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#81C784" />
                  <stop offset="100%" stopColor="#A5D6A7" stopOpacity="0" />
                </radialGradient>
              </defs>

              <g filter="url(#terrain-shadow)">
                <rect x="10" y="10" width="880" height="480" rx="20" fill="url(#terrain-bg)" />
                <rect x="10" y="470" width="880" height="24" rx="0" fill="url(#terrain-edge)" opacity="0.6" />
                <rect x="10" y="488" width="880" height="6" rx="3" fill="#4E342E" opacity="0.3" />
              </g>

              <ellipse cx="200" cy="150" rx="120" ry="80" fill="url(#hill-1)" opacity="0.5" />
              <ellipse cx="650" cy="350" rx="140" ry="90" fill="url(#hill-2)" opacity="0.4" />
              <ellipse cx="450" cy="250" rx="100" ry="60" fill="url(#hill-1)" opacity="0.3" />

              <g opacity="0.06">
                {Array.from({ length: 40 }).map((_, i) => (
                  <circle key={`g-${i}`} cx={20 + (i * 53) % 860} cy={20 + (i * 37) % 460} r={1 + (i % 3) * 0.5} fill="#1B5E20" />
                ))}
              </g>

              <g>
                <path d="M0,240 Q100,210 200,250 Q350,310 450,270 Q550,230 650,260 Q780,300 900,270" fill="none" stroke="#BDBDBD" strokeWidth="18" strokeLinecap="round" opacity="0.45" />
                <path d="M0,240 Q100,210 200,250 Q350,310 450,270 Q550,230 650,260 Q780,300 900,270" fill="none" stroke="#E0E0E0" strokeWidth="1.5" strokeDasharray="10 14" opacity="0.6" />

                <path d="M320,0 Q300,90 330,180 Q360,270 340,360 Q310,440 350,520" fill="none" stroke="#BDBDBD" strokeWidth="14" strokeLinecap="round" opacity="0.4" />
                <path d="M320,0 Q300,90 330,180 Q360,270 340,360 Q310,440 350,520" fill="none" stroke="#E0E0E0" strokeWidth="1.2" strokeDasharray="8 12" opacity="0.5" />

                <path d="M600,0 Q620,110 590,200 Q560,290 600,380 Q630,450 610,520" fill="none" stroke="#BDBDBD" strokeWidth="12" strokeLinecap="round" opacity="0.35" />
                <path d="M600,0 Q620,110 590,200 Q560,290 600,380 Q630,450 610,520" fill="none" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="6 10" opacity="0.4" />

                <path d="M100,480 Q200,420 350,440 Q500,460 700,430 Q800,420 900,450" fill="none" stroke="#BDBDBD" strokeWidth="10" strokeLinecap="round" opacity="0.3" />
              </g>

              {[
                [70, 90], [160, 170], [750, 80], [820, 160], [100, 400], [440, 130],
                [500, 380], [730, 420], [680, 200], [260, 330], [400, 450], [50, 260],
                [860, 300], [540, 90], [370, 200], [770, 340],
              ].map(([tx, ty], i) => (
                <g key={`tree-${i}`} transform={`translate(${tx}, ${ty})`} filter="url(#tree-shadow)" opacity={0.8 + (i % 3) * 0.07}>
                  <rect x="-2" y="2" width="4" height="10" rx="1.5" fill="#6D4C41" />
                  <ellipse cx="0" cy="-2" rx={8 + (i % 3) * 2} ry={7 + (i % 2) * 2} fill={i % 3 === 0 ? "#388E3C" : i % 3 === 1 ? "#43A047" : "#2E7D32"} />
                  <ellipse cx={-3 + (i % 2) * 6} cy="1" rx={5 + (i % 2)} ry={5 + (i % 3)} fill={i % 2 === 0 ? "#4CAF50" : "#66BB6A"} opacity="0.7" />
                  <ellipse cx="0" cy={-6 - (i % 2)} rx={5 + (i % 3)} ry={4 + (i % 2)} fill="#81C784" opacity="0.5" />
                </g>
              ))}

              {centreMapPins.map((centre, idx) => {
                const bx = (centre.x / 100) * 900;
                const by = (centre.y / 100) * 520;
                const isHov = hoveredCentre === centre.id;
                const bScale = isHov ? 1.08 : 1;
                const variants = [
                  { w: 44, h: 34, floors: 1 },
                  { w: 50, h: 38, floors: 2 },
                  { w: 42, h: 32, floors: 1 },
                  { w: 46, h: 36, floors: 1 },
                  { w: 48, h: 34, floors: 2 },
                  { w: 44, h: 32, floors: 1 },
                ];
                const v = variants[idx];
                return (
                  <g key={`bld-${centre.id}`} transform={`translate(${bx}, ${by})`} filter="url(#building-shadow)">
                    <g style={{ transform: `scale(${bScale})`, transformOrigin: "center bottom", transition: "transform 0.3s ease" }}>
                      <rect x={-v.w/2} y={-v.h} width={v.w} height={v.h} rx="2" fill={centre.color} stroke="#BDBDBD" strokeWidth="0.6" />
                      {v.floors === 2 && (
                        <rect x={-v.w/2 + 4} y={-v.h - 16} width={v.w - 8} height={18} rx="1.5" fill={centre.color} stroke="#BDBDBD" strokeWidth="0.5" />
                      )}
                      <polygon points={`0,${-v.h - (v.floors === 2 ? 28 : 14)} ${-v.w/2 - 3},${-v.h - (v.floors === 2 ? 14 : 0)} ${v.w/2 + 3},${-v.h - (v.floors === 2 ? 14 : 0)}`} fill={centre.roof} stroke={centre.roof} strokeWidth="0.5" opacity="0.9" />
                      {[-1, 1].map((side) => (
                        <g key={`win-${side}`}>
                          <rect x={side * (v.w/4) - 4} y={-v.h + 6} width="8" height="7" rx="1" fill="#BBDEFB" stroke="#90CAF9" strokeWidth="0.5" />
                          <line x1={side * (v.w/4)} y1={-v.h + 6} x2={side * (v.w/4)} y2={-v.h + 13} stroke="#90CAF9" strokeWidth="0.3" />
                          <line x1={side * (v.w/4) - 4} y1={-v.h + 9.5} x2={side * (v.w/4) + 4} y2={-v.h + 9.5} stroke="#90CAF9" strokeWidth="0.3" />
                        </g>
                      ))}
                      <rect x="-5" y="-16" width="10" height="16" rx="1.5" fill="#795548" />
                      <circle cx="3" cy="-7" r="1" fill="#FFC107" />
                      <rect x={-v.w/2} y="-1.5" width={v.w} height="3" rx="1" fill="rgba(0,0,0,0.06)" />
                    </g>
                  </g>
                );
              })}
            </svg>

            <div className="absolute inset-0" style={{ overflow: "visible" }}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: "visible" }}>
                {[
                  [25, 24, 62, 18], [62, 18, 65, 40], [65, 40, 80, 70],
                  [80, 70, 22, 72], [22, 72, 38, 44], [38, 44, 25, 24],
                  [38, 44, 65, 40], [25, 24, 22, 72], [62, 18, 80, 70],
                ].map(([x1, y1, x2, y2], i) => (
                  <line key={`conn-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E53935" strokeWidth="0.3" strokeDasharray="1.5 1.5" opacity="0.25" className="map-path-animate" />
                ))}
              </svg>

              <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl px-3 py-2 md:px-4 md:py-2.5 shadow-lg border border-white/50">
                  <p className="text-[10px] md:text-xs font-extrabold text-primary uppercase tracking-widest">Rainbow Preschool</p>
                  <p className="text-[9px] md:text-[11px] text-muted-foreground font-medium">6 Centres Across Thane</p>
                </div>
              </div>

              <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl px-2.5 py-1.5 md:px-3 md:py-2 shadow-lg border border-white/50 flex items-center gap-1.5">
                  <div className="relative w-3 h-3">
                    <div className="absolute inset-0 rounded-full bg-primary map-glow" />
                    <div className="absolute inset-0.5 rounded-full bg-primary" />
                  </div>
                  <span className="text-[9px] md:text-[11px] font-medium text-foreground">Click to open Maps</span>
                </div>
              </div>

              {centreMapPins.map((centre, idx) => {
                const isHovered = hoveredCentre === centre.id;
                return (
                  <a
                    key={centre.id}
                    href={centre.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute cursor-pointer"
                    style={{
                      left: `${centre.x}%`,
                      top: `${centre.y}%`,
                      zIndex: isHovered ? 30 : 10,
                      transform: "translate(-50%, -100%)",
                    }}
                    onMouseEnter={() => setHoveredCentre(centre.id)}
                    onMouseLeave={() => setHoveredCentre(null)}
                    data-testid={`map-pin-${centre.id}`}
                  >
                    <div
                      className="flex flex-col items-center"
                      style={{
                        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        transform: isHovered ? "translateY(-8px) scale(1.15)" : "translateY(0) scale(1)",
                        animationDelay: `${idx * 0.3}s`,
                      }}
                    >
                      <div className={`
                        relative px-2 py-1 md:px-3 md:py-1.5 rounded-lg mb-1 transition-all duration-300
                        ${isHovered
                          ? "bg-primary text-white shadow-xl shadow-primary/30"
                          : "bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-100 shadow-lg border border-white/60 dark:border-gray-600 backdrop-blur-sm"
                        }
                      `}>
                        <span className="text-[9px] md:text-xs font-bold whitespace-nowrap block">{centre.label}</span>
                        <div className={`flex items-center justify-center gap-0.5 transition-all duration-300 overflow-hidden ${isHovered ? "opacity-100 max-h-4 mt-0.5" : "opacity-0 max-h-0"}`}>
                          <NavigationIcon className="w-2 h-2 md:w-2.5 md:h-2.5" />
                          <span className="text-[7px] md:text-[9px]">Directions</span>
                        </div>
                        <div className={`absolute left-1/2 -bottom-1 w-2 h-2 rotate-45 -translate-x-1/2 transition-colors duration-300 ${isHovered ? "bg-primary" : "bg-white/95 dark:bg-gray-800/95"}`} />
                      </div>

                      <div className="relative">
                        <svg width="24" height="36" viewBox="0 0 24 36" className="drop-shadow-lg">
                          <defs>
                            <linearGradient id={`pg3d-${centre.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#EF5350" />
                              <stop offset="100%" stopColor="#C62828" />
                            </linearGradient>
                          </defs>
                          <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill={`url(#pg3d-${centre.id})`} />
                          <circle cx="12" cy="11" r="5" fill="white" opacity="0.95" />
                          <circle cx="12" cy="11" r="2.5" fill="#E53935" />
                        </svg>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                          <div className={`rounded-full bg-primary/30 blur-[3px] transition-all duration-300 ${isHovered ? "w-5 h-2" : "w-3 h-1"}`} />
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6 mb-8" data-testid="text-map-cta">
        Click on any location to open directions in Google Maps
      </p>
    </div>
  );
}
