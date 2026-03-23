import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "arcade-dark": "#07071a",
        "arcade-glow": "#00ff88",
        "arcade-neon": "#ff2d78",
        "arcade-yellow": "#ffe600",
        "arcade-cyan": "#00e5ff",
        "pixel-gray": "#2a2a4a"
      }
    }
  },
  plugins: []
};

export default config;
