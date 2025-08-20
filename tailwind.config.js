// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}",
    "./pages/**/*.{astro,html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#b46a2b",
          dark: "#9c5417",
        },
      },
    },
  },
  plugins: [],
};
