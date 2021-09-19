module.exports = {
  main: 'src/index.tsx',
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
