/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(var(--primary-50))', 100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))', 300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))', 500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))', 700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))', 900: 'hsl(var(--primary-900))',
        },
        navy: {
          50: 'hsl(var(--primary-50))', 100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))', 300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))', 500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))', 700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))', 900: 'hsl(var(--primary-900))',
        },
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
