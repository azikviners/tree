let lastReply = null; // храним последний ответ в памяти

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method === "POST") {
    try {
      const data = await req.json();
      // Извлекаем текст сообщения
      const message = data.message?.text || "";

      // Здесь можно обработать или отправить ответ в Telegram
      lastReply = `Вы написали: ${message}`;

      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}

// Функция для получения последнего ответа
export function getLastReply() {
  return lastReply;
}
