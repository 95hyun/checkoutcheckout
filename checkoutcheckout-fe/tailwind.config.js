/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        "primary-dark": "#2563EB",
        "primary-light": "#93C5FD",
        secondary: "#10B981",
        "secondary-dark": "#059669",
        "secondary-light": "#6EE7B7",
        accent: "#8B5CF6",
        "accent-dark": "#7C3AED",
        "accent-light": "#C4B5FD",
        background: "#F3F4F6",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
    },
  },
  plugins: [],
}