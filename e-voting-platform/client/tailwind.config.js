/** @type {import('tailwindcss').Config} */
// FROM THIS:
// import formsPlugin from '@tailwindcss/forms'; // If you want to name it
// OR directly:
// plugins: [
//   require('@tailwindcss/forms'),
// ],

// TO THIS:
import forms from "@tailwindcss/forms"; // Import the plugin

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#10B981",
        accent: "#F59E0B",
        neutralBg: "#F9FAFB",
        darkText: "#1F2937",
        mediumText: "#4B5563",
        lightText: "#9CA3AF",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    forms, // Use the imported plugin
  ],
};
