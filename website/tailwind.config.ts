import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-primary)",
                foreground: "var(--text-primary)",
                furnace: {
                    black: "#050505",
                    gray: "#0F0F0F",
                    primary: "#FF5500", // Ember
                    secondary: "#1A1A1A",
                    accent: "#FFD700", // Gold
                }
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 10px rgba(255, 85, 0, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(255, 85, 0, 0.8), 0 0 10px rgba(255, 215, 0, 0.6)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
