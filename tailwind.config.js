/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/assets"
  ],
  theme: {
    extend: {
      keyframes:{
        myanimation : {
          '0%': { transform: 'skew(0deg,0deg)' },
          '25%': { transform: 'skew(10deg,0.5deg)' },
          '50%': { transform: 'skew(0deg,0deg)' },
          '75%': { transform: 'skew(-10deg,-0.5deg)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

