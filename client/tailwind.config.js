/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#8b5cf6',
        'primary-light': '#a78bfa',
        'primary-dark': '#7c3aed',
        
        // Secondary Colors
        'secondary': '#10b981',
        'secondary-light': '#34d399',
        
        // Accent Colors
        'accent': '#f59e0b',
        'accent-light': '#fbbf24',
        
        // Neutral Colors
        'dark': '#0f172a',
        'dark-light': '#1e293b',
        'gray-dark': '#4b5563',
        'gray': '#9ca3af',
        'gray-light': '#e5e7eb',
        'light': '#f9fafb',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'gradient-flow': 'gradientFlow 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradientFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
