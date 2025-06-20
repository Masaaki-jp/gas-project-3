// 監視対象のURL
const TARGET_URL = "https://kakaku.com/item/K0001692166/";

// 通知先のメールアドレス
const RECIPIENT_EMAIL = "YOUR_MAIL_ADDRESS"; // 

// 価格表示が検出されたかどうかのフラグを保存するプロパティキー
const NOTIFIED_FLAG_KEY = "price_notified";

function checkPriceAndNotify() {
  let content;
  try {
    // ウェブページのコンテンツを取得
    const response = UrlFetchApp.fetch(TARGET_URL);
    content = response.getContentText();
  } catch (e) {
    // ページの取得に失敗した場合のエラーハンドリング
    Logger.log("ウェブページの取得中にエラーが発生しました: " + e.toString());
    MailApp.sendEmail(RECIPIENT_EMAIL, "Chromebook価格監視エラー", "ウェブページの取得に失敗しました。\n\n詳細: " + e.toString());
    return;
  }

  // 既に通知済みかどうかをチェック
  const hasNotified = PropertiesService.getScriptProperties().getProperty(NOTIFIED_FLAG_KEY);

  // まだ通知していなければ処理を続行
  if (hasNotified !== "true") {
    // 販売価格の有無をチェックするキーワードやパターン
    // 価格.comのページ構造によって調整が必要になる場合があります。
    // ここでは「最安価格」や「価格」といった文字列があるかを簡易的にチェックします。
    // より厳密なチェックには正規表現やHTML解析が必要ですが、まずは簡易的な方法で。
    const priceKeywords = ["円", "最安価格", "価格", "販売店"]; // 価格表示に関連する可能性のあるキーワード

    let priceFound = false;
    for (const keyword of priceKeywords) {
      if (content.includes(keyword)) {
        // キーワードが見つかっても、それが販売価格ではない可能性もあるため、
        // もし誤検知が多い場合は、より具体的なHTML要素のチェックが必要になります。
        // 例: <span class="price">のようなクラス名で価格が表示されている場合など
        // しかし、初回検知ならこれで十分なことも多いです。
        priceFound = true;
        break;
      }
    }

    if (priceFound) {
      // 販売価格が見つかったら通知メールを送信
      const subject = "【通知】ASUS Chromebook CB14 の価格情報が掲載されました！";
      const body = `ASUS Chromebook CB14 (CB1405CTA) の価格情報が、以下のページに掲載された可能性があります。\n\n`;
      const fullBody = body + TARGET_URL + "\n\nご確認ください。";

      try {
        MailApp.sendEmail(RECIPIENT_EMAIL, subject, fullBody);
        Logger.log("価格通知メールを送信しました。");

        // 一度通知したら、次回以降は通知しないようにフラグを設定
        PropertiesService.getScriptProperties().setProperty(NOTIFIED_FLAG_KEY, "true");
      } catch (e) {
        Logger.log("メール送信中にエラーが発生しました: " + e.toString());
      }
    } else {
      Logger.log("価格情報はまだ見つかりませんでした。");
    }
  } else {
    Logger.log("既に価格通知は完了しています。");
  }
}