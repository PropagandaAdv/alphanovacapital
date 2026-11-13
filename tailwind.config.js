/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Opzionale: il componente usa valori arbitrari (bg-[#0A1F3C]) e funziona anche senza questi token.
      colors: {
        an: { navy: '#0A1F3C', deep: '#06142A', bronze: '#C2883A', gold: '#C59B27' },
      },
      fontFamily: { sans: ['Montserrat', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
