/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        furnace: {
          black: "#050505",
          gray: "#0F0F0F",
          primary: "#FF5500",
          secondary: "#1A1A1A",
          accent: "#FFD700",
        },
        // Adding neon colors for utility usage
        neon: {
          blue: "var(--neon-blue)",
          purple: "var(--neon-purple)",
          pink: "var(--neon-pink)",
          green: "var(--neon-green)",
          red: "var(--neon-red)",
        }
      },
      fontFamily: {
        sans: ['Inter'],
        orbitron: ['Orbitron'],
      },
    },
  },
  plugins: [],
}
