import { KNOWLEDGE } from "./knowledge.js";

// Edit this one constant to change the assistant's voice and behavior.
const SYSTEM_PROMPT = `You are the portfolio assistant for Shane Ramirez. Think analytically and speak like a thoughtful, kind human mentor: clear, honest, and practical. First identify what the visitor is actually trying to decide or understand. Lead with the direct answer, then give the reasoning or context that makes it useful, and end with one practical next step when appropriate. For analytics questions, distinguish observation from interpretation, mention relevant assumptions or limitations, and explain what evidence would improve the answer. Keep it short and conversational rather than turning every reply into a checklist.

Use only the provided knowledge for facts about Shane; if something isn't there, say you're not sure and suggest contacting her. Never fabricate. Ask exactly one clarifying question when a request is too broad to answer well. When clarification is needed, put the question only in followUp.question so it isn't repeated in reply, and provide 2–3 specific selectable options. For a well-scoped request, answer first and optionally offer a useful next-step choice; don't ask a follow-up after every reply. Options must be concise and relevant, and clicking one should continue the same conversation.

Use natural phrasing and contractions, and reply in the visitor’s language. Usually answer in 2–5 short sentences. Use plain prose and avoid bullets unless requested. Do not write a wall of text or use excessive emojis. For recruiter questions, highlight relevant projects, skills, and internship availability, then suggest the resume or contact section. You may answer general questions about careers or learning data analytics with honest, practical advice; don't present general advice as a fact about Shane. If useful, tie it gently to the portfolio. Stay calm with rude or off-topic messages and redirect politely. Decline requests for harmful help or private information. Share only the location information present in the knowledge; never infer or reveal a street address, phone number, or other private details. Make it clear that projects are academic, thesis, or portfolio work and skill percentages are self-assessed. Roadmap items are plans, not completed work. Never claim that a paid service, result, price, or schedule is promised.

Return only a valid JSON object with no markdown fences: {"reply":"A concise natural-language answer","followUp":null} or {"reply":"A concise natural-language answer","followUp":{"question":"One brief question","options":["Option one","Option two"]}}. Keep the reply to 2–5 short sentences. Set followUp to null when no useful next step is needed. When clarification is needed, put the question only in followUp.question, not in reply, so it is not repeated. Never put personal facts in options unless they appear in the supplied knowledge.

PORTFOLIO KNOWLEDGE (the only source for personal facts):`;


const MAX_MESSAGE_CHARS = 1400;
const MAX_REQUEST_BYTES = 12000;
const json = (body, status, headers = {}) => Response.json(body, {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers }
});

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://memonttorrie.github.io";
    const origin = request.headers.get("Origin") || "";
    const cors = origin === allowedOrigin ? {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    } : { "Vary": "Origin" };

    if (request.method === "OPTIONS") {
      return origin === allowedOrigin
        ? new Response(null, { status: 204, headers: cors })
        : json({ error: "Forbidden origin" }, 403);
    }
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, cors);
    if (origin !== allowedOrigin) return json({ error: "Forbidden origin" }, 403);
    if (!env.OPENAI_API_KEY) return json({ error: "Assistant is not configured" }, 503, cors);

    const contentLength = Number(request.headers.get("Content-Length") || 0);
    if (contentLength > MAX_REQUEST_BYTES) return json({ error: "Request is too large" }, 413, cors);

    // Anonymous public widget: use the connecting IP only as an ephemeral limiter key.
    // Cloudflare's native limiter is approximate and scoped by edge location.
    const ip = request.headers.get("CF-Connecting-IP") || "unknown-client";
    if (env.CHAT_RATE_LIMITER) {
      const { success } = await env.CHAT_RATE_LIMITER.limit({ key: ip });
      if (!success) return json({ error: "Too many messages. Please try again in a minute." }, 429, cors);
    }

    let rawBody;
    try { rawBody = await request.text(); } catch { return json({ error: "Invalid request" }, 400, cors); }
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) return json({ error: "Request is too large" }, 413, cors);

    let body;
    try { body = JSON.parse(rawBody); } catch { return json({ error: "Invalid JSON" }, 400, cors); }
    if (!Array.isArray(body.messages)) return json({ error: "Messages are required" }, 400, cors);

    const messages = body.messages.slice(-6);
    if (!messages.length || messages[messages.length - 1]?.role !== "user") {
      return json({ error: "A user message is required" }, 400, cors);
    }
    for (const message of messages) {
      if (!message || !["user", "assistant"].includes(message.role) || typeof message.content !== "string" || !message.content.trim()) {
        return json({ error: "Invalid message" }, 400, cors);
      }
      if (message.content.length > MAX_MESSAGE_CHARS) return json({ error: "Message is too long" }, 413, cors);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    try {
      const upstream = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-6-luna",
          instructions: `${SYSTEM_PROMPT}\n${JSON.stringify(KNOWLEDGE)}`,
          input: messages,
          max_output_tokens: 420
        }),
        signal: controller.signal
      });
      if (!upstream.ok) return json({ error: "Assistant service unavailable" }, 502, cors);
      const result = await upstream.json();
      const outputText = (result.output || [])
        .flatMap(item => item.content || [])
        .filter(item => item.type === "output_text" && typeof item.text === "string")
        .map(item => item.text)
        .join("\n")
        .trim();
      if (!outputText) return json({ error: "Assistant returned an empty reply" }, 502, cors);
      let assistant = null;
      try {
        const start = outputText.indexOf("{");
        const end = outputText.lastIndexOf("}");
        if (start >= 0 && end > start) assistant = JSON.parse(outputText.slice(start, end + 1));
      } catch { /* A plain-text model response still gets returned safely. */ }
      const reply = typeof assistant?.reply === "string" ? assistant.reply.trim() : outputText;
      if (!reply) return json({ error: "Assistant returned an empty reply" }, 502, cors);
      const rawFollowUp = assistant?.followUp;
      const options = Array.isArray(rawFollowUp?.options)
        ? rawFollowUp.options.filter(option => typeof option === "string" && option.trim()).slice(0, 3).map(option => option.trim().slice(0, 80))
        : [];
      const followUp = typeof rawFollowUp?.question === "string" && options.length > 1
        ? { question: rawFollowUp.question.trim().slice(0, 180), options }
        : null;
      const lastUserText = messages[messages.length - 1].content.toLowerCase();
      const showContact = /recruit|intern|resume|cv|hire|contact|reach|email/.test(lastUserText);
      return json({ reply, showContact, followUp }, 200, cors);
    } catch {
      return json({ error: "Assistant request timed out or failed" }, 502, cors);
    } finally {
      clearTimeout(timeout);
    }
  }
};
