import { getLastReply } from "./webhook";

export const config = { runtime: "edge" };

export default async function handler(req) {
  const reply = getLastReply();
  return new Response(JSON.stringify({ reply }), {
    headers: { "Content-Type": "application/json" },
  });
}
