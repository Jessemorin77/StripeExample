import { type Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
"./node_modules/flowbite/**/*.js",
"./pages/**/*.{ts,tsx}",
    "./public/**/*.html",
],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"),
  ],
} satisfies Config;
