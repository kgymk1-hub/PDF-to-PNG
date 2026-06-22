# PostPNG Maker

PostPNG Maker は、スマホでの X 投稿に特化した PDF→PNG/JPEG 変換 PWA です。PDF資料をブラウザ内だけで画像化し、X の 1 投稿最大 4 枚に合わせた「4枚1セット」の投稿単位で整理できます。通常モードでは、X 以外の LINE 共有、メール添付、Web掲載、保存用にも使いやすい汎用 PDF 画像化ツールとして利用できます。

## 特長

- PDFを外部サーバーへ送信せず、すべてブラウザ内で処理
- Android Chrome の縦向きスマホ画面を優先した固定ヘッダー・固定ボトムバーUI
- X投稿モードと通常モードの切り替え
- X投稿モードは白背景PNG、横幅1600px標準、4ページごとの投稿セット表示
- 通常モードはPNG/JPEG、解像度倍率、ページ範囲、背景色を選択可能
- 各ページの個別保存、全ページZIP保存、X投稿セット別ZIP保存
- 変換中の進捗表示、キャンセル、分かりやすいエラー表示
- 投稿本文下書き、ALTテキスト下書き、コピー補助
- PWA対応。ホーム画面に追加してアプリのように起動可能

## 使い方

1. `index.html` を静的Webサーバーで配信してブラウザで開きます。
   - 開発時の例: `python3 -m http.server 8000` → `http://localhost:8000/`
2. 画面下部またはファイルカードの「PDFを選択」からPDFを選びます。
3. 必要に応じて「X投稿モード」または「通常モード」を選択します。
4. 出力設定を確認します。
5. 固定ボトムバーの「変換する」を押します。
6. プレビューからページごとの「保存」、または「全保存」「セット保存」を使って保存します。

## X投稿モード

X投稿モードは、PDF資料をXに投稿しやすい画像セットへ変換するモードです。

- 出力形式: PNG固定
- 背景: 白固定
- 標準横幅: 1600px
- 余白トリミング: 簡易自動トリミングをON/OFF可能
- セット管理: 4ページごとに「X投稿セット 1」「X投稿セット 2」…として表示
- セット操作: セット別ZIP保存、本文コピー、ALTまとめコピー、セット名コピー
- ファイル名例: `original_xset01_page-01.png`

投稿本文下書きでは、タイトル・更新日・補足・ハッシュタグを保存できます。セットごとに「画像は1〜4ページ目です」のようなページ範囲を自動反映します。ALTテキストはOCRなしの手入力・テンプレート方式です。

## 通常モード

通常モードは、X以外にも使いやすい汎用PDF画像化モードです。

- 出力形式: PNG / JPEG
- JPEG品質: 60〜92
- 解像度倍率: 1x / 1.5x / 2x / 3x
- ページ範囲: `1-4`, `1,3,5`, `2-4,8` 形式
- 背景: 白 / 透明（PNGのみ）/ 黒
- 全ページZIP保存、ページごとの個別保存

細かい文字の資料は2x以上がおすすめです。3xは高画質ですが、スマホでは変換時間とメモリ使用量が増えます。

## プライバシーとセキュリティ

選択したPDF、Canvasで生成した画像、ZIPファイルは外部サーバーへアップロードされません。変換は PDF.js、Canvas API、JSZip を使ってブラウザ内で実行します。PDF本体や生成画像は localStorage に保存しません。localStorage にはモード設定、変換設定、投稿本文テンプレート、ALTテンプレートのみ保存します。

## 対応ブラウザ

優先対応は Android Chrome 最新版です。PWA起動と縦向きスマホ画面での親指操作を重視しています。iPhone Safari、Windows Chrome、Microsoft Edge、macOS Chrome / Safari でも利用できますが、端末のメモリやブラウザ実装により大きなPDFの変換性能は変わります。

## PWAとしてホーム画面に追加する方法

1. HTTPS または localhost で配信されたURLを Android Chrome で開きます。
2. Chromeメニューから「ホーム画面に追加」を選択します。
3. 追加後はホーム画面の PostPNG アイコンから起動できます。

Service Worker はアプリシェルをキャッシュします。更新時は `service-worker.js` の `CACHE_NAME` を変更してください。新しいService Workerが有効化されると、`controllerchange` でページを再読み込みして新しいキャッシュに切り替えます。

## 大きなPDF・変換が遅い場合の注意

- 20ページを超えるPDFでは事前確認を表示します。
- スマホでメモリ不足になりそうな場合は、通常モードでページ範囲を分ける、倍率を下げる、X投稿モードで横幅1200pxを選ぶなどを試してください。
- 変換は1ページずつ順番に処理します。キャンセルした場合も途中まで作成済みの画像は保存できます。

## 開発者向けファイル構成

```text
index.html
css/style.css
js/app.js
js/pdf-service.js
js/image-service.js
js/export-service.js
js/ui-service.js
js/settings-service.js
js/pwa-service.js
libs/pdf.min.js
libs/pdf.worker.min.js
libs/jszip.min.js
icons/icon-192.png
icons/icon-512.png
icons/maskable-icon-512.png
manifest.json
service-worker.js
README.md
```

## 使用ライブラリ

- PDF.js: PDF読み込みとCanvas描画
- JSZip: 複数画像のZIP生成
- Canvas API: 白背景固定、簡易トリミング、リサイズ、PNG/JPEG生成
- File API / Blob / Object URL: PDF読み込みとダウンロード
- localStorage: UI設定と下書きテンプレート保存
- Service Worker: PWAキャッシュ

## 既知の制限と今後の対応

- パスワード付きPDFには対応していません。
- OCRによる自動ALT生成は未実装です。現在はテンプレートと手入力で補助します。
- 自動トリミングは簡易版です。背景色やデザインによっては余白検出が期待通りにならない場合があります。
- 高度な手動トリミング、スワイプ式拡大プレビュー、File System Access API、複数PDF同時処理、クラウド連携は今後の拡張候補です。

## ライセンス

このリポジトリのライセンスに従います。PDF.js と JSZip を同梱する場合は、それぞれのライセンス表記を確認してください。
