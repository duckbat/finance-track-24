/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const withMT = require("@material-tailwind/react/utils/withMT");
/** @type {import('tailwindcss').Config} */
module.exports = withMT(
  {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx,html}",
    ],
    darkMode: 'media',
    theme: {
      extend: {},
    },
    plugins: [
    ],
  }
)
