/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'xhs-red': '#FE2C55',
        'xhs-bg': '#F9F9F9',
        'xhs-gray': '#999999',
        'xhs-dark': '#333333',
        'xhs-light': '#F5F5F5',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
