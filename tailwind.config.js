// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Add this future flag
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // New sophisticated palette
        'background-dark': '#000000',
        'text-light': '#FFFFFF',
        'accent-blue': '#AECBFA',   // A soft, subtle blue
        'accent-pink': '#F5D6E4',   // A pale, desaturated pink
        'border-light': 'rgba(255, 255, 255, 0.2)', // For subtle borders
      },
      fontFamily: {
        // Using a clean sans-serif font is key for this look
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // You can keep the rest of the extend section as is
    },
  },
  plugins: [],
}