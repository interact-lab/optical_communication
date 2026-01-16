/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        accent: "var(--color-accent)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Computer Modern Serif"', 'Georgia', 'serif'],
        mono: ['"Computer Modern Typewriter"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-lg': '100px 100px',
      }
    },
  },
  plugins: [],
}
