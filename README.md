# gas-project-3
Raspberry Pi 6の製品ページができたらメールでお知らせします🍓

# Raspberry Pi 6 製品ページ監視スクリプト

このプロジェクトは、Raspberry Pi 6の公式製品ページが公開されたことを自動で検知し、メールで通知するためのGoogle Apps Script（GAS）です。

---

### **使い方**

1.  **Google Apps Script (GAS) 環境のセットアップ**
    * このリポジトリのコード (`コード.js`など) を、あなたのGoogle Apps Scriptプロジェクトにコピー＆ペーストします。
    * スクリプト内の以下の項目を、あなたの情報に合わせて書き換えます。
        ```javascript
        const recipientEmail = "your-email-address@example.com";
        const url = "[https://www.raspberrypi.com/products/raspberry-pi-6/](https://www.raspberrypi.com/products/raspberry-pi-6/)"; // 監視したいURL
        const productName = "Raspberry Pi 6";
        ```

2.  **トリガーの設定**
    * GASエディタで、左メニューの「**トリガー**」アイコンをクリックします。
    * 「**トリガーを追加**」ボタンをクリックし、以下の設定を行います。
        * **実行する関数を選択**: `checkRaspberryPi6PageCreation`
        * **イベントのソースを選択**: `時間主導型`
        * **時間ベースのトリガーのタイプを選択**: `日別タイマー` または `時間`
        * **注意**: サーバーへの負荷を考慮し、**12時間ごと**や**1日1回**など、頻度を低く設定することを強く推奨します。

---

### **免責事項**

* このスクリプトは、公式サイトの仕様変更やセキュリティ対策によって機能しなくなる可能性があります。
* スクリプトの実行により発生した問題や損害について、作者は一切の責任を負いません。
