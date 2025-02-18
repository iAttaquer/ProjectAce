import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      height: {
        'screen-minus-8.5rem': 'calc(100vh - 8.5rem)',
        'screen-minus-10.5rem': 'calc(100vh - 10.5rem)',
        'screen-minus-13.5rem': 'calc(100vh - 13.5rem)',
      },
    },
  },
  plugins: [
    daisyui, typography
  ],
} satisfies Config;
