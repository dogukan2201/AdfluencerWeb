/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f1fe",
          100: "#cce4fd",
          200: "#99c9fb",
          300: "#66aef9",
          400: "#3393f7",
          500: "#0078f5",
          600: "#0060c4",
          700: "#004893",
          800: "#003062",
          900: "#001831",
        },
      },
    },
  },
  plugins: [],
};
