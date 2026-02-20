import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#C84B31",
        "accent-dim": "#8B3421",
        surface: "#0a0a0a",
        panel: "#111111",
        border: "#1e1e1e",
        muted: "#444444",
        dim: "#888888",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Syne'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
