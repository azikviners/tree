(async () => {
  const BOT_URL = "https://example.vercel.app/api/webhook"; // 

  async function captureSelection() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const bitmap = await imageCapture.grabFrame();
    track.stop();

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);
    return canvas.toDataURL("image/png");
  }

  function showPopup(text) {
    let box = document.getElementById("answer-box");
    if (!box) {
      box = document.createElement("div");
      box.id = "answer-box";
      box.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; 
        max-width: 300px; background: rgba(0,0,0,0.85);
        color: #fff; padding: 10px; border-radius: 8px;
        font-family: sans-serif; z-index: 999999;
      `;
      document.body.appendChild(box);
    }
    box.innerText = text;
  }

  document.addEventListener("click", async (e) => {
    if (e.button === 0) {
      e.preventDefault();
      const screenshot = await captureSelection();

      const res = await fetch(BOT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: screenshot }),
      });

      const data = await res.json();
      if (data.reply) {
        showPopup(data.reply);
      }
    }
  });
})();
