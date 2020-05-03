module.exports = {
  pages: {
    background: {
      entry: 'src/pages/background/main.ts',
      filename: 'background.html'
    },
    options: {
      entry: 'src/pages/options/main.ts',
      filename: 'options.html'
    },
    popup: {
      entry: 'src/pages/popup/main.ts',
      filename: 'popup.html'
    }
  },
  transpileDependencies: ['vuetify']
}
