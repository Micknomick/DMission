module.exports = {
  content: [
    './app/views/**/*.html.erb',  // Railsビュー
    './app/helpers/**/*.rb',      // Railsヘルパー
    './app/assets/stylesheets/**/*.css', // CSS
    './app/javascript/**/*.js'    // JavaScript
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Interフォント
      },
    },
  },
  plugins: [], // 必要なTailwindプラグインを追加
};
