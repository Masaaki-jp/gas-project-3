/**
 * Raspberry Pi 6の製品ページURLの存在をチェックし、
 * ページが作成された場合にメール通知を送信するスクリプト。
 *
 * 【重要】
 * - このスクリプトはページの存在をHTTPステータスコードで判断します。
 * - 404（Not Found）以外のステータスコードを検知した場合に通知します。
 */
function checkRaspberryPi6PageCreation() {
  // --- 設定項目 ---
  // 監視対象の製品URL
  const url = "https://www.raspberrypi.com/products/raspberry-pi-6/";

  // 通知を受け取りたいメールアドレス
  const recipientEmail = "itohmasaaki0302+RasPi6@gmail.com";

  // 通知メールに表示される製品名
  const productName = "Raspberry Pi 6";
  // --- 設定項目ここまで ---

  try {
    // 1. URLのHTTPステータスコードを取得
    // 404エラーでもスクリプトが停止しないよう、muteHttpExceptionsをtrueに設定
    const options = {
      'muteHttpExceptions': true,
      // ボット対策を回避するため、User-Agentも引き続き設定
      'headers': {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
    const response = UrlFetchApp.fetch(url, options);
    const statusCode = response.getResponseCode();

    // 2. スクリプトの実行履歴から前回の状態を取得
    const userProperties = PropertiesService.getUserProperties();
    const lastState = userProperties.getProperty('lastRaspberryPi6PageStatus');

    Logger.log(`現在のステータスコード: ${statusCode}, 前回の状態: ${lastState ? lastState : 'なし (初回実行)'}`);

    // 3. ステータスコードの変化を検出してメール通知
    // 前回が404で、今回が200など404以外になった場合に通知
    if (statusCode !== 404 && lastState === '404') {
      const subject = `【新製品リリース通知】${productName}の製品ページが作成されました！`;
      const body = `${productName}の製品ページが公式サイトに新しく作成されました。\n\n` +
                   `製品ページ: ${url}\n\n` +
                   `この通知はGoogle Apps Scriptによって自動送信されています。`;

      MailApp.sendEmail(recipientEmail, subject, body);
      Logger.log("新しいページを検知し、通知メールを送信しました。");

      // 4. 現在の状態を保存
      userProperties.setProperty('lastRaspberryPi6PageStatus', 'found');
    } else {
      // 状態に変化がない場合（404が継続、またはページがすでに存在）
      Logger.log("状態に変化はありませんでした。");
      // 現在の状態を保存
      if (statusCode === 404) {
        userProperties.setProperty('lastRaspberryPi6PageStatus', '404');
      } else {
        userProperties.setProperty('lastRaspberryPi6PageStatus', 'found');
      }
    }

  } catch (e) {
    Logger.log("スクリプト実行中に予期せぬエラーが発生しました: " + e.toString());
    MailApp.sendEmail(
      recipientEmail,
      `【スクリプトエラー】${productName}URLチェック`,
      `Google Apps Scriptの実行中に予期せぬエラーが発生しました。\n` +
      `エラーメッセージ: ${e.toString()}\n` +
      `URL: ${url}\n\n` +
      `このメールはスクリプトのエラーにより自動送信されました。`
    );
  }
}