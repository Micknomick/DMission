const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './public/*.html',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
    './app/views/**/*.{html.erb,html,slim,js}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '10xl': '10rem',   // 10xlは10rem（非常に大きいフォントサイズ）
        '12xl': '12rem',   // 12xlは12rem
        '15xl': '15rem',   // 15xlは15rem（さらに大きく）
      },
      colors: {
        "dark": "#292935",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ]
}
