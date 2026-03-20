/** @type {import('tailwindcss').Config} */

// FraudEye design tokens — Phase 16 updated
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      /* ── Color system ─────────────────────────────────── */
      colors: {
        fe: {
          bg: "#020617",
          surface: "#0F172A",
          card: "#0D1627",
          elevated: "#0A1628",
          inner: "#080F1A",
          border: "#1E293B",
          "border-strong": "#334155",

          cyan: "#22D3EE",
          violet: "#8B5CF6",
          danger: "#F43F5E",
          success: "#22C55E",
          warning: "#F59E0B",

          text: "#F8FAFC",
          muted: "#94A3B8",
          subtle: "#64748B",
          faint: "#475569",
          ghost: "#334155",
        },
      },

      /* ── Sidebar widths ───────────────────────────────── */
      width: {
        sidebar: "224px",
        "sidebar-collapsed": "64px",
        drawer: "380px",
        "drawer-sm": "320px",
      },

      /* ── Animation keyframes ──────────────────────────── */
      keyframes: {
        "fe-shimmer": {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "fe-pulse-ring": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.75)", opacity: "0" },
        },
        "fe-fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fe-scan": {
          "0%": { top: "-2px", opacity: "0" },
          "4%": { opacity: "1" },
          "96%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
        "fe-shine-sweep": {
          "0%": { left: "-100%" },
          "100%": { left: "160%" },
        },
        "fe-critical-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 0 1px rgba(244,63,94,0.32), 0 0 14px rgba(244,63,94,0.09)",
          },
          "50%": {
            boxShadow:
              "0 0 0 1px rgba(244,63,94,0.58), 0 0 28px rgba(244,63,94,0.20)",
          },
        },
      },

      animation: {
        "fe-shimmer": "fe-shimmer 1.6s linear infinite",
        "fe-pulse-ring": "fe-pulse-ring 2.2s ease-in-out infinite",
        "fe-fade-up": "fe-fade-up 0.3s ease forwards",
        "fe-critical-pulse": "fe-critical-pulse 2.8s ease-in-out infinite",
      },

      /* ── Typography ───────────────────────────────────── */
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Cascadia Code", "monospace"],
      },
      fontSize: {
        "2xs": ["9px", { lineHeight: "1.4" }],
        xs: ["10px", { lineHeight: "1.5" }],
        sm: ["11px", { lineHeight: "1.6" }],
        base: ["12px", { lineHeight: "1.65" }],
        md: ["13px", { lineHeight: "1.65" }],
      },
      lineHeight: {
        "tight-plus": "1.25",
      },
      letterSpacing: {
        "fe-wide": "0.07em",
        "fe-wider": "0.10em",
        "fe-widest": "0.14em",
      },

      /* ── Spacing additions ────────────────────────────── */
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },

      /* ── Border radius ────────────────────────────────── */
      borderRadius: {
        "fe-sm": "6px",
        "fe-md": "8px",
        "fe-lg": "12px",
        "fe-xl": "16px",
      },

      /* ── Box shadows (glow tiers) ─────────────────────── */
      boxShadow: {
        "fe-soft-cyan":
          "0 0 0 1px rgba(34,211,238,0.18), 0 0 14px rgba(34,211,238,0.07)",
        "fe-soft-violet":
          "0 0 0 1px rgba(139,92,246,0.18), 0 0 14px rgba(139,92,246,0.07)",
        "fe-emphasis-cyan":
          "0 0 0 1px rgba(34,211,238,0.35), 0 0 22px rgba(34,211,238,0.12)",
        "fe-emphasis-violet":
          "0 0 0 1px rgba(139,92,246,0.35), 0 0 22px rgba(139,92,246,0.12)",
        "fe-critical":
          "0 0 0 1px rgba(244,63,94,0.40),  0 0 20px rgba(244,63,94,0.14)",
        "fe-card": "0 4px 16px rgba(0,0,0,0.3)",
        "fe-panel": "0 8px 32px rgba(0,0,0,0.4)",
        "fe-overlay": "0 16px 48px rgba(0,0,0,0.55)",
      },

      /* ── Screens — explicit breakpoints ──────────────── */
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
      },

      /* ── Z-index layers ───────────────────────────────── */
      zIndex: {
        sidebar: "20",
        topbar: "30",
        drawer: "40",
        overlay: "50",
        modal: "60",
        toast: "100",
      },
    },
  },

  plugins: [],
};
