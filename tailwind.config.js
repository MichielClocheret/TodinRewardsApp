/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "dmsans-thin": ["DMSans-Thin"],
        "dmsans-light": ["DMSans-Light"],
        "dmsans": ["DMSans-Regular"],
        "dmsans-medium": ["DMSans-Medium"],
        "dmsans-semibold": ["DMSans-SemiBold"],
        "dmsans-bold": ["DMSans-Bold"],
        "dmsans-extrabold": ["DMSans-ExtraBold"],
        "dmsans-black": ["DMSans-Black"],
      },
    },
  },
  plugins: [],
}