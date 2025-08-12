/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBlue: '#0F1829',
        lightBlue: '#5AA9E6',
        btnBlue: '#2E294E',
        navbtn: '#314966',
        navBlue: '#132146',
        darkGreen: '#0F292A',
        lightGreen: '#47DD7D',
        pigmentGreen: '#4DAA57',
        lightRed: '#F6726F',
        darkRed: '#360201',
        warmYellow: '#F8943C',
        darkOrange: '#F18805',
        darkBrown: '#2D1E23',
        newPurple: '#AB83DC',
        clientPurple: '#3D3765',
        darkPurple: 'rgba(50,13,109,.2)',
        rawRed: 'rgba(255, 29, 21, 1)',
      },
      boxShadow: {
        'inner': 'inset -3px -3px 6px rgba(255,255,255,.3), inset 3px 3px 6px #000',
        'outer': '-2px -2px 4px rgba(255,255,255,.3), 3px 3px 6px #000',
        'submenu': 'inset 0 -2px 4px #000, inset 0 2px 4px #000'
      }
    },
  },
  plugins: [],
}