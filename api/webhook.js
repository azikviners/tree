export const config = { api: { bodyParser: true } };

let lastReply = "";

export default async function handler(req, res) {
  const { message } = req.body;
  if (message?.chat?.id == 6342951618 && message?.text) {
    lastReply = message.text;
  }
  res.status(200).send("OK");
}

export function getLastReply() {
  return lastReply;
}
