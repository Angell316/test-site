/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0a',
          800: '#131313',
          700: '#1a1a1a',
          600: '#242424',
        },
        crimson: {
          primary: '#dc143c',
          light: '#ff1744',
          dark: '#c2185b',
          glow: '#ff4081',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'purple-glow': 'linear-gradient(135deg, rgba(220, 20, 60, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
      },
      boxShadow: {
        'crimson-glow': '0 0 40px rgba(220, 20, 60, 0.3)',
        'crimson-glow-lg': '0 0 60px rgba(220, 20, 60, 0.4)',
      },
    },
  },
  plugins: [],
}

