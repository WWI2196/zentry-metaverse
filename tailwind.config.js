/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure this covers all your component files
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use the exact name defined in @font-face
        general: ['general', 'sans-serif'], 
        'circular-web': ['circular-web', 'sans-serif'],
        'robert-medium': ['robert-medium', 'sans-serif'],
        'robert-regular': ['robert-regular', 'sans-serif'],
        zentry: ['zentry', 'sans-serif'],
      },
      // ... other extensions if you have them
    },
  },
  plugins: [],
}
