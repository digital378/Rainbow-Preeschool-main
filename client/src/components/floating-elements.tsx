import { motion } from "framer-motion";

interface FloatingElementProps {
  className?: string;
  delay?: number;
  duration?: number;
  children?: React.ReactNode;
}

export function FloatingShape({ 
  className = "", 
  delay = 0,
  duration = 6,
  children 
}: FloatingElementProps) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ y: 0, rotateX: 0, rotateY: 0 }}
      animate={{ 
        y: [0, -20, 0],
        rotateX: [0, 10, 0],
        rotateY: [0, 15, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

export function Cube3D({ 
  size = 60, 
  color = "primary",
  className = "",
  delay = 0 
}: { 
  size?: number; 
  color?: "primary" | "secondary" | "accent";
  className?: string;
  delay?: number;
}) {
  const colorClasses = {
    primary: "bg-primary/20 border-primary/30",
    secondary: "bg-secondary/20 border-secondary/30",
    accent: "bg-accent/20 border-accent/30"
  };

  return (
    <FloatingShape className={className} delay={delay} duration={8}>
      <motion.div
        className="relative"
        style={{ 
          width: size, 
          height: size,
          transformStyle: "preserve-3d",
          transform: "rotateX(-20deg) rotateY(30deg)"
        }}
        animate={{
          rotateY: [30, 390],
          rotateX: [-20, -20]
        }}
        transition={{
          duration: 20,
          delay,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Front face */}
        <div 
          className={`absolute w-full h-full rounded-lg border-2 backdrop-blur-sm ${colorClasses[color]}`}
          style={{ transform: `translateZ(${size/2}px)` }}
        />
        {/* Back face */}
        <div 
          className={`absolute w-full h-full rounded-lg border-2 backdrop-blur-sm ${colorClasses[color]}`}
          style={{ transform: `rotateY(180deg) translateZ(${size/2}px)` }}
        />
        {/* Right face */}
        <div 
          className={`absolute w-full h-full rounded-lg border-2 backdrop-blur-sm ${colorClasses[color]}`}
          style={{ transform: `rotateY(90deg) translateZ(${size/2}px)` }}
        />
        {/* Left face */}
        <div 
          className={`absolute w-full h-full rounded-lg border-2 backdrop-blur-sm ${colorClasses[color]}`}
          style={{ transform: `rotateY(-90deg) translateZ(${size/2}px)` }}
        />
        {/* Top face */}
        <div 
          className={`absolute w-full h-full rounded-lg border-2 backdrop-blur-sm ${colorClasses[color]}`}
          style={{ transform: `rotateX(90deg) translateZ(${size/2}px)` }}
        />
        {/* Bottom face */}
        <div 
          className={`absolute w-full h-full rounded-lg border-2 backdrop-blur-sm ${colorClasses[color]}`}
          style={{ transform: `rotateX(-90deg) translateZ(${size/2}px)` }}
        />
      </motion.div>
    </FloatingShape>
  );
}

export function Sphere3D({ 
  size = 80, 
  color = "primary",
  className = "",
  delay = 0 
}: { 
  size?: number; 
  color?: "primary" | "secondary" | "accent";
  className?: string;
  delay?: number;
}) {
  const gradientClasses = {
    primary: "from-primary/30 via-primary/10 to-transparent",
    secondary: "from-secondary/40 via-secondary/15 to-transparent",
    accent: "from-accent/30 via-accent/10 to-transparent"
  };

  return (
    <FloatingShape className={className} delay={delay} duration={7}>
      <div
        className={`rounded-full bg-gradient-to-br ${gradientClasses[color]} backdrop-blur-sm border border-white/10`}
        style={{ 
          width: size, 
          height: size,
          boxShadow: `inset -${size/4}px -${size/4}px ${size/2}px rgba(0,0,0,0.1), inset ${size/6}px ${size/6}px ${size/3}px rgba(255,255,255,0.2)`
        }}
      />
    </FloatingShape>
  );
}

export function Ring3D({ 
  size = 100, 
  color = "primary",
  className = "",
  delay = 0 
}: { 
  size?: number; 
  color?: "primary" | "secondary" | "accent";
  className?: string;
  delay?: number;
}) {
  const borderClasses = {
    primary: "border-primary/40",
    secondary: "border-secondary/50",
    accent: "border-accent/40"
  };

  return (
    <FloatingShape className={className} delay={delay} duration={10}>
      <motion.div
        className={`rounded-full border-4 ${borderClasses[color]}`}
        style={{ 
          width: size, 
          height: size,
          transformStyle: "preserve-3d"
        }}
        animate={{
          rotateX: [45, 405],
          rotateY: [0, 360]
        }}
        transition={{
          duration: 15,
          delay,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </FloatingShape>
  );
}

export function Pyramid3D({ 
  size = 60, 
  color = "primary",
  className = "",
  delay = 0 
}: { 
  size?: number; 
  color?: "primary" | "secondary" | "accent";
  className?: string;
  delay?: number;
}) {
  const colorClasses = {
    primary: "border-primary/30",
    secondary: "border-secondary/40",
    accent: "border-accent/30"
  };

  const bgClasses = {
    primary: "bg-primary/15",
    secondary: "bg-secondary/20",
    accent: "bg-accent/15"
  };

  return (
    <FloatingShape className={className} delay={delay} duration={9}>
      <motion.div
        className="relative"
        style={{ 
          width: size, 
          height: size,
          transformStyle: "preserve-3d",
          transform: "rotateX(-30deg)"
        }}
        animate={{
          rotateY: [0, 360]
        }}
        transition={{
          duration: 18,
          delay,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Base */}
        <div 
          className={`absolute w-full h-full ${bgClasses[color]} border-2 ${colorClasses[color]} backdrop-blur-sm`}
          style={{ 
            transform: `rotateX(90deg) translateZ(-${size/2}px)`,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)"
          }}
        />
        {/* Front face */}
        <div 
          className={`absolute ${bgClasses[color]} border-2 ${colorClasses[color]} backdrop-blur-sm`}
          style={{ 
            width: size,
            height: size * 0.866,
            transform: `translateZ(${size * 0.29}px) rotateX(30deg)`,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)"
          }}
        />
        {/* Right face */}
        <div 
          className={`absolute ${bgClasses[color]} border-2 ${colorClasses[color]} backdrop-blur-sm`}
          style={{ 
            width: size,
            height: size * 0.866,
            transform: `rotateY(120deg) translateZ(${size * 0.29}px) rotateX(30deg)`,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)"
          }}
        />
        {/* Left face */}
        <div 
          className={`absolute ${bgClasses[color]} border-2 ${colorClasses[color]} backdrop-blur-sm`}
          style={{ 
            width: size,
            height: size * 0.866,
            transform: `rotateY(-120deg) translateZ(${size * 0.29}px) rotateX(30deg)`,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)"
          }}
        />
      </motion.div>
    </FloatingShape>
  );
}

export function Star3D({ 
  size = 50, 
  color = "secondary",
  className = "",
  delay = 0 
}: { 
  size?: number; 
  color?: "primary" | "secondary" | "accent";
  className?: string;
  delay?: number;
}) {
  const gradientClasses = {
    primary: "from-primary/40 to-primary/10",
    secondary: "from-secondary/50 to-secondary/20",
    accent: "from-accent/40 to-accent/10"
  };

  return (
    <FloatingShape className={className} delay={delay} duration={5}>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, delay, repeat: Infinity, ease: "linear" }}
      >
        <svg width={size} height={size} viewBox="0 0 50 50" className="drop-shadow-lg">
          <defs>
            <linearGradient id={`star-gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={`stop-color-${color === 'primary' ? 'pink' : color === 'secondary' ? 'yellow' : 'blue'}-400`} style={{ stopColor: color === 'primary' ? '#ec4899' : color === 'secondary' ? '#facc15' : '#3b82f6' }} />
              <stop offset="100%" className={`stop-color-${color === 'primary' ? 'pink' : color === 'secondary' ? 'yellow' : 'blue'}-200`} style={{ stopColor: color === 'primary' ? '#f9a8d4' : color === 'secondary' ? '#fef08a' : '#93c5fd', stopOpacity: 0.4 }} />
            </linearGradient>
          </defs>
          <polygon
            points="25,2 31,18 48,18 34,28 40,45 25,35 10,45 16,28 2,18 19,18"
            fill={`url(#star-gradient-${color})`}
            opacity="0.7"
          />
        </svg>
      </motion.div>
    </FloatingShape>
  );
}

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Left side elements */}
      <Cube3D size={50} color="primary" className="top-[15%] left-[5%]" delay={0} />
      <Sphere3D size={70} color="secondary" className="top-[35%] left-[8%]" delay={1} />
      <Ring3D size={80} color="accent" className="top-[60%] left-[3%]" delay={2} />
      <Star3D size={40} color="secondary" className="top-[80%] left-[10%]" delay={0.5} />
      
      {/* Right side elements */}
      <Sphere3D size={60} color="primary" className="top-[20%] right-[6%]" delay={1.5} />
      <Pyramid3D size={55} color="secondary" className="top-[45%] right-[4%]" delay={0.8} />
      <Cube3D size={45} color="accent" className="top-[70%] right-[8%]" delay={2.5} />
      <Ring3D size={60} color="primary" className="top-[85%] right-[3%]" delay={1.2} />
    </div>
  );
}
