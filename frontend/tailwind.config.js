export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#4782BE",
        primaryDark: "#1D375B",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        skill: {
          primary: "#D8E3F3",
          secondary: "#9DBBDD",
          tertiary: "#4782BE",
          bg: "#FFFFFF",
          dark: "#1D375B",
          chart1: "#4782BE",
          chart2: "1D375B",
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
};
