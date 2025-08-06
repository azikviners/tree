(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const div = document.createElement("div");
  div.style = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 999999;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3)
  `;
  div.innerText = "⌛ Отправка...";
  document.body.appendChild(div);

  const canvas = await html2canvas(document.body);
  canvas.toBlob(async blob => {
    await fetch("/api/telegram", { method: "POST", body: blob });

    div.innerText = "⌛ Ожидание ответа...";
    let reply = "";

    for (let i = 0; i < 30; i++) {
      await sleep(3000);
      const res = await fetch("/api/reply");
      const data = await res.json();
      if (data.reply && data.reply !== reply) {
        reply = data.reply;
        div.innerText = "💬 Ответ: " + reply;
        return;
      }
    }

    div.innerText = "❌ Ответ не получен";
  });
})();
