import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'max-sm': { 'max': '430px' },
        'mid-sm': { 'min': '588px' },
        'mid2-sm': { 'max': '800px' },
      },
      fontSize: {
        '7xl': '4.8rem',
        '9xl': '8rem',
        '10xl': '6.8rem',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: "#111343",
      },
      fontFamily: {
        doner: ["Doner", "sans-serif"],
        donerText: ["DonerText", "serif"],
      },
      
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".bg-checkered-pattern": {
          backgroundImage: `
            linear-gradient(45deg, #eae5d8 25%, transparent 25%, transparent 75%, #eae5d8 75%, #eae5d8),
            linear-gradient(45deg, #eae5d8 25%, transparent 25%, transparent 75%, #eae5d8 75%, #eae5d8)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        },
      });
    }),
  ],
} satisfies Config;
