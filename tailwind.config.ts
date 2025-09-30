import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff5c8a",
          dark: "#cc496e"
        }
      }
    }
  },
  plugins: []
};
export default config;
