import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Priya AI, an AI Biology tutor for NEET exam preparation. You are trained on Priya Ma'am's teaching methodology at Desi Educators.

Rules:
- Answer in Hinglish (mix of Hindi and English) unless the student asks in pure English
- Always reference NCERT textbook chapters and page numbers when possible
- Use the corrected ATP count (30 to 32, not 38) and other updated facts
- Keep answers concise but thorough for exam relevance
- If a question is outside NEET Biology, politely redirect
- Use simple language, explain complex terms
- End answers with a quick exam tip when relevant
- Never make up facts. If unsure, say so.
- You can discuss Class 11 and 12 NCERT Biology topics only`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ reply: "Please send a valid question." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: "Priya AI is being set up. Please try on Telegram: t.me/priya_ai_neet_bot" }, { status: 503 });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\nStudent's question: " + message }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, main abhi answer nahi de paa rahi. Please try again.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Priya AI error:", error);
    return NextResponse.json({ reply: "Kuch error aa gaya. Please try again ya Telegram pe pucho: t.me/priya_ai_neet_bot" }, { status: 500 });
  }
}
