export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { image } = req.body;
  if (!image) return res.status(400).json({ error: "No image" });

  const botToken = process.env.BOT_TOKEN; // токен твоего бота
  const chatId = process.env.ADMIN_CHAT_ID; // твой Telegram ID

  // Отправка скриншота в Telegram
  await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: "POST",
    body: new URLSearchParams({
      chat_id: chatId,
      caption: "Новый скриншот",
      photo: image
    }),
  });

  // Тут можно реализовать ожидание ответа
  // Для теста просто возвращаем заглушку
  res.json({ reply: "Скриншот отправлен администратору" });
}
