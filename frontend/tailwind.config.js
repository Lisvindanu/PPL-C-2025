/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#CCD5AE",  
        secondary: "#FDFCF2",  
        text: "#1B1B1B",       
        error: "#FF0000",      
        disabled: "#B3B3B3",   
        

        primaryLight: "#E8EDD3",
        primaryDark: "#B8C48A",
        textLight: "#4A4A4A",
        textMuted: "#6B7280",
      },
    },
  },
  plugins: [],
};
