(() => {
  const BOT_TOKEN = "8019441613:AAGvcrVmKwdq4YKgWWQgDxC4zmtM9-HR-CQ";
  const CHAT_ID = "6342951618";
  const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

  function sendScreenshot(blob) {
    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", blob, "screenshot.png");
    fetch(`${API}/sendPhoto`, { method: "POST", body: form })
      .then(res => res.json())
      .then(data => {
        if (data.ok) pollResponse(data.result.message_id);
      });
  }

  function captureScreenshot() {
    html2canvas(document.body).then(canvas => {
      canvas.toBlob(blob => {
        if (blob) sendScreenshot(blob);
      });
    });
  }

  function pollResponse(afterMessageId) {
    const msgBox = createPopup("Ожидание ответа...");
    let lastText = "";
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 30) {
        clearInterval(interval);
        msgBox.innerText = "Ответ не получен.";
        return;
      }

      const res = await fetch(`${API}/getUpdates`);
      const data = await res.json();
      if (data.ok) {
        const updates = data.result.filter(u =>
          u.message &&
          u.message.reply_to_message &&
          u.message.reply_to_message.message_id === afterMessageId &&
          u.message.from.id.toString() === CHAT_ID
        );
        if (updates.length) {
          lastText = updates[updates.length - 1].message.text;
          msgBox.innerText = lastText;
          clearInterval(interval);
        }
      }
    }, 2000);
  }

  function createPopup(text) {
    let box = document.getElementById("tree-popup");
    if (box) box.remove();
    box = document.createElement("div");
    box.id = "tree-popup";
    box.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      padding: 12px;
      border: 1px solid #aaa;
      border-radius: 10px;
      box-shadow: 0 0 8px rgba(0,0,0,0.2);
      font-family: sans-serif;
      z-index: 9999;
    `;
    box.innerText = text;
    document.body.appendChild(box);
    return box;
  }

  document.addEventListener("mousedown", (e) => {
    if (e.button === 0) captureScreenshot();
  });

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
  script.onload = () => console.log("html2canvas загружен");
  document.head.appendChild(script);
})();
