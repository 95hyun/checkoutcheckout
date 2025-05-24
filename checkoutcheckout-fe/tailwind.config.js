/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 빨간색을 주요 색상으로 사용
        primary: "#DC2626", // red-600
        "primary-dark": "#B91C1C", // red-700
        "primary-light": "#EF4444", // red-500
        secondary: "#FFFFFF", // 흰색을 보조 색상으로 사용
        "secondary-dark": "#F9FAFB",
        "secondary-light": "#FFFFFF",
        accent: "#F3F4F6", // 밝은 회색을 강조색으로 사용
        "accent-dark": "#E5E7EB",
        "accent-light": "#F9FAFB",
        background: "#FFFFFF", // 흰색 배경
        success: "#10B981", // 기존 색상 유지
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', 'sans-serif'],
        mono: ['monospace'],
      },
      fontSize: {
        '2xs': '0.625rem', // 10px
        'xs': '0.75rem',   // 12px
        'sm': '0.875rem',  // 14px
        'base': '1rem',    // 16px
        'lg': '1.125rem',  // 18px
        'xl': '1.25rem',   // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px
        '7xl': '4.5rem',   // 72px
      },
      borderRadius: {
        'full': '9999px',
      },
    },
  },
  plugins: [],
}