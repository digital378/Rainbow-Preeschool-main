import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // ── PREMIUM BORDER RADIUS SCALE ──────────────────────────────────────
      // Upgraded from 9/6/3px → 20/14/8px for a softer, more premium feel
      // (Apple HIG / Airbnb / Notion inspiration)
      borderRadius: {
        xs:    "0.375rem",  /*  6px — inline badges, tags */
        sm:    "0.5rem",    /*  8px — smallest components */
        md:    "0.875rem",  /* 14px — inputs, secondary buttons */
        DEFAULT:"0.875rem", /* 14px */
        lg:    "1.25rem",   /* 20px — cards, standard buttons, modals */
        xl:    "1.75rem",   /* 28px — feature cards, hero elements */
        "2xl": "2.25rem",   /* 36px — large featured sections */
        "3xl": "3rem",      /* 48px — oversized decorative elements */
        full:  "9999px",    /* ∞   — pills, full-round avatars/icons */
      },

      // ── PREMIUM SHADOW SCALE ─────────────────────────────────────────────
      // Current shadows are all opacity-0 (completely flat).
      // These soft, layered shadows give genuine depth (Apple / Notion style).
      boxShadow: {
        xs:     "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        sm:     "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        DEFAULT:"0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
        md:     "0 6px 16px -4px rgb(0 0 0 / 0.10), 0 4px 8px -2px rgb(0 0 0 / 0.06)",
        lg:     "0 12px 28px -6px rgb(0 0 0 / 0.12), 0 6px 14px -4px rgb(0 0 0 / 0.07)",
        xl:     "0 20px 40px -8px rgb(0 0 0 / 0.14), 0 10px 20px -6px rgb(0 0 0 / 0.08)",
        "2xl":  "0 32px 64px -12px rgb(0 0 0 / 0.18), 0 16px 32px -8px rgb(0 0 0 / 0.10)",
        // Semantic shadows
        "card":        "0 1px 3px rgb(0 0 0 / 0.06), 0 4px 16px -4px rgb(0 0 0 / 0.08)",
        "card-hover":  "0 4px 12px rgb(0 0 0 / 0.08), 0 12px 32px -6px rgb(0 0 0 / 0.12)",
        "glass":       "0 4px 24px -4px rgb(0 0 0 / 0.08), inset 0 1px 0 rgb(255 255 255 / 0.60)",
        "glass-dark":  "0 4px 24px -4px rgb(0 0 0 / 0.30), inset 0 1px 0 rgb(255 255 255 / 0.06)",
        "primary-glow":"0 8px 32px rgb(220 38 38 / 0.25), 0 4px 16px rgb(220 38 38 / 0.15)",
        "warm-glow":   "0 8px 32px rgb(251 146 60 / 0.20), 0 4px 16px rgb(251 146 60 / 0.10)",
        "inner-sm":    "inset 0 1px 3px rgb(0 0 0 / 0.08)",
        none:          "none",
      },

      // ── SURFACE / SEMANTIC BACKGROUND COLORS ─────────────────────────────
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border:     "hsl(var(--border) / <alpha-value>)",
        input:      "hsl(var(--input) / <alpha-value>)",
        // Warm organic surfaces (for alternating sections)
        surface: {
          warm:   "hsl(var(--surface-warm) / <alpha-value>)",
          cream:  "hsl(var(--surface-cream) / <alpha-value>)",
          subtle: "hsl(var(--surface-subtle) / <alpha-value>)",
        },
        card: {
          DEFAULT:    "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border:     "hsl(var(--card-border) / <alpha-value>)",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border:     "hsl(var(--popover-border) / <alpha-value>)",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          border:     "var(--primary-border)",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          border:     "var(--secondary-border)",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          border:     "var(--muted-border)",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          border:     "var(--accent-border)",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          border:     "var(--destructive-border)",
        },
        ring: "hsl(var(--ring) / <alpha-value>)",
        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          ring:       "hsl(var(--sidebar-ring) / <alpha-value>)",
          DEFAULT:    "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          border:     "hsl(var(--sidebar-border) / <alpha-value>)",
        },
        "sidebar-primary": {
          DEFAULT:    "hsl(var(--sidebar-primary) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          border:     "var(--sidebar-primary-border)",
        },
        "sidebar-accent": {
          DEFAULT:    "hsl(var(--sidebar-accent) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border:     "var(--sidebar-accent-border)",
        },
        status: {
          online:  "rgb(34 197 94)",
          away:    "rgb(245 158 11)",
          busy:    "rgb(239 68 68)",
          offline: "rgb(156 163 175)",
        },
      },

      // ── FONTS ─────────────────────────────────────────────────────────────
      fontFamily: {
        sans:    ["var(--font-sans)"],
        serif:   ["var(--font-serif)"],
        mono:    ["var(--font-mono)"],
        heading: ["var(--font-heading)"],
      },

      // ── TRANSITIONS ───────────────────────────────────────────────────────
      transitionTimingFunction: {
        spring:  "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth:  "cubic-bezier(0.22, 1, 0.36, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast:   "150ms",
        normal: "250ms",
        slow:   "400ms",
      },

      // ── KEYFRAMES & ANIMATIONS ────────────────────────────────────────────
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% center" },
          to:   { backgroundPosition: "-200% center" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        marquee:   "marquee 30s linear infinite",
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "scale-in":"scale-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        float:     "float 4s ease-in-out infinite",
        shimmer:   "shimmer 3s linear infinite",
      },

      // ── BACKGROUND IMAGES ─────────────────────────────────────────────────
      backgroundImage: {
        "gradient-radial":         "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "noise":                   "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        "shimmer":                 "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
