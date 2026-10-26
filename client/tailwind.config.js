/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        github: {
          dark: '#0d1117',
          card: '#161b22',
          cardHover: '#1f242c',
          border: '#30363d',
          borderLight: '#484f58',
          text: '#c9d1d9',
          muted: '#8b949e',
          accent: '#58a6ff'
        },
        olive: {
          50: '#f5f7f0',
          100: '#e7edd9',
          200: '#cfdcaf',
          300: '#b1c780',
          400: '#94af54',
          500: '#779339',
          600: '#5c742c',
          700: '#465824',
          800: '#384620',
          900: '#2f3b1e',
          950: '#17200c',
          level0: '#161b22',
          level1: '#263b19',
          level2: '#3d5c24',
          level3: '#5a8533',
          level4: '#7eb644'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace']
      }
    },
  },
  plugins: [],
};
