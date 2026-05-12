// このファイルはメールテンプレートのHTMLを返すAPIです
// Supabase Dashboard > Authentication > Email Templates に貼り付けてください
import { NextResponse } from "next/server";

export async function GET() {
  const html = getConfirmEmailTemplate();
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export function getConfirmEmailTemplate(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LinkBox メール確認</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:32px 40px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:20px;">🔗</span>
              </div>
              <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">LinkBox</span>
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;letter-spacing:-0.5px;">メールアドレスの確認</h1>
            <p style="margin:0 0 24px;font-size:14px;color:#71717a;line-height:1.6;">LinkBoxへのご登録ありがとうございます。<br>以下のボタンをクリックして登録を完了してください。</p>

            <div style="text-align:center;margin:32px 0;">
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;border-radius:12px;font-size:15px;font-weight:600;letter-spacing:0.2px;box-shadow:0 4px 12px rgba(99,102,241,0.4);">
                メールアドレスを確認する
              </a>
            </div>

            <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;text-align:center;">ボタンが機能しない場合は以下のURLをコピーしてください</p>
            <p style="margin:0;font-size:11px;color:#a1a1aa;text-align:center;word-break:break-all;background:#f4f4f5;padding:10px;border-radius:8px;">{{ .ConfirmationURL }}</p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px;"><div style="height:1px;background:#f4f4f5;"></div></td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:#a1a1aa;">このメールに身に覚えがない場合は無視してください。</p>
            <p style="margin:0;font-size:12px;color:#a1a1aa;">リンクは24時間有効です。</p>
            <p style="margin:16px 0 0;font-size:11px;color:#d4d4d8;">&copy; 2025 LinkBox. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
