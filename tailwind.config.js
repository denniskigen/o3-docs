/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./components/**/*.jsx", "./pages/**/*.{md,mdx}", "./theme.config.tsx"],
  plugins: [require("@tailwindcss/typography")],
};
