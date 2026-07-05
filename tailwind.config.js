/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hilcoe: {
          blue: "#193461",
          bright: "#4e7ad2",
          red: "#cc4b4b",
          green: "#4caf50",
          dark: "#111111",
          gray: "#f8f9fa",
          text: "#1a2236",
          muted: "#64748b",
          border: "#e6eaf2",
          soft: "#eef2fb",
        },
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        portal: "0 20px 50px -12px rgba(0, 27, 77, 0.5)",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        floatIn: "floatIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
