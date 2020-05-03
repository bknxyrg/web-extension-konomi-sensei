# 作業監視用このみ先生

Chrome extension with Vue.jsの試作プロジェクト。  
MPAでbackground/options/popupを書き出せばそのまま動作する感。

## Usage (Chrome用)

### 拡張機能の有効化

1. [ここ](https://github.com/BknXyRg/web-extension-konomi-sensei/releases)から拡張機能をダウンロードし、解凍する
2. [拡張機能の設定](chrome://extensions/)(chrome://extensions/)を開き、"パッケージ化されていない拡張機能を読み込む"で解凍した拡張機能を指定する

### 拡張機能の使用方法

1. 作業中にブロックしておきたいサイトで拡張を開き、サイト or ページでブロックする
2. 作業時間を決め、"作業開始"ボタンを押下する
3. 拡張の右下にあるアイコンからオプションページをする。ブロック中に表示する画像や、ブロック済みのサイト、ページを確認可能

画像は自前で用意するか、[ここ](https://github.com/BknXyRg/web-extension-konomi-sensei/blob/master/example.png)から。

## Requirement

- Node.js
- Vue CLI 3 以上

## Development

background/popup/optionsの主な改修先

- background  
  `src\pages\background\App.vue`
- popup  
  `src\views\PopupView.vue`
- options  
  `src\views\OptionsView.vue`

store  
Vuexの代替。`State`にプロパティを追加し、`Store`内に`getter/setter`を用意すれば、background/popup/optionsで共通的に使用可能。

## License

[MIT](https://opensource.org/licenses/MIT)
