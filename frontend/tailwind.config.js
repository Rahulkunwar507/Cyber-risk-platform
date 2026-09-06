/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0B0F17', // app background
        panel: '#111725', // card surface
        panel2: '#151D31', // raised surface
        line: '#1E2839', // borders / dividers
        ink: '#E8ECF4', // primary text
        muted: '#93A0B8', // secondary text
        faint: '#5C6B85', // tertiary text
        accent: '#4D7CFE', // brand blue
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F43F5E',
        info: '#38BDF8',
        orange: '#FB923C',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
