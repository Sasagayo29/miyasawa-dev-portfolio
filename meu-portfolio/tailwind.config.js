/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Usaremos monospace como fonte principal para dar o visual de IDE
        mono: ['"Fira Code"', '"JetBrains Mono"', 'monospace', 'ui-monospace'],
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Paleta Dark Mode / Industrial
        background: '#0D1117',
        surface: '#161B22',
        terminal: {
          green: '#2ea043',
          neon: '#238636',
          yellow: '#d29922', // Amarelo Kinross/Radix
        }
      }
    },
  },
  plugins: [],
}