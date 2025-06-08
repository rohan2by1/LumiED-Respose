import { gray } from "tailwindcss/colors";

export const content = [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
];

export const theme = {
  extend: {
    colors: {
      brand: {
        light: gray[200],
        dark: gray[900],
        primary: "#0014ff",
        secondary: "#0114f821",
        tertiary: "#0014ff7d",
      },
      background: "var(--background)",
      foreground: "var(--foreground)",
    },
    boxShadow: {
      brand: "0 0 15px 2px #0114f821",
      selected: "0px 0px 5px 0px #0014ff",
    },
  },
};

export const plugins = [];
