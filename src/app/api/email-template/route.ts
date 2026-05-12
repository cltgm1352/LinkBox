import { NextResponse } from "next/server";

export async function GET() {
  const html = getConfirmEmailTemplate();
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export function getConfirmEmailTemplate(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>LinkBox メール確認</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;">
  <tr>
    <td align="center" style="padding:40px 16px;">

      <!-- Card -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;overflow:hidden;">

        <!-- Header (bgcolor fallback for email clients) -->
        <tr>
          <td bgcolor="#6366f1" align="center" style="background-color:#6366f1;padding:32px 40px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width:40px;height:40px;background-color:rgba(255,255,255,0.2);border-radius:10px;text-align:center;vertical-align:middle;font-size:22px;padding:6px;">
                  &#128279;
                </td>
                <td style="padding-left:10px;">
                  <span style="font-size:22px;font-weight:700;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,sans-serif;letter-spacing:-0.5px;">LinkBox</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px 24px;">
            <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#18181b;font-family:-apple-system,BlinkMacSystemFont,sans-serif;letter-spacing:-0.5px;">メールアドレスの確認</p>
            <p style="margin:0 0 28px;font-size:14px;color:#71717a;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">LinkBoxへのご登録ありがとうございます。<br>以下のボタンをクリックして登録を完了してください。</p>

            <!-- Button -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td align="center" style="padding:4px 0 32px;">
                  <a href="{{ .ConfirmationURL }}"
                    style="display:inline-block;padding:14px 40px;background-color:#6366f1;color:#ffffff;text-decoration:none;border-radius:12px;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,sans-serif;letter-spacing:0.2px;">
                    メールアドレスを確認する
                  </a>
                </td>
              </tr>
            </table>

            <!-- Divider -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr><td style="height:1px;background-color:#f4f4f5;font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>

            <!-- Fallback URL -->
            <p style="margin:20px 0 6px;font-size:12px;color:#a1a1aa;text-align:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">ボタンが機能しない場合は以下のURLをコピーしてください</p>
            <p style="margin:0;font-size:11px;color:#a1a1aa;text-align:center;word-break:break-all;background-color:#f4f4f5;padding:12px;border-radius:8px;font-family:monospace;">{{ .ConfirmationURL }}</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding:20px 40px 32px;">
            <p style="margin:0 0 4px;font-size:12px;color:#a1a1aa;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">このメールに身に覚えがない場合は無視してください。</p>
            <p style="margin:0 0 12px;font-size:12px;color:#a1a1aa;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">リンクは24時間有効です。</p>
            <p style="margin:0;font-size:11px;color:#d4d4d8;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">&copy; 2025 LinkBox. All rights reserved.</p>
          </td>
        </tr>

      </table>
      <!-- /Card -->

    </td>
  </tr>
</table>
</body>
</html>`;
}
