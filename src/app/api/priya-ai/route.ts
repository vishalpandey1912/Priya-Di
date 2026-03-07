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
      console.error("GEMINI_API_KEY is not set in environment variables");
      return NextResponse.json(
        { reply: "Priya AI is being set up. Please try on Telegram: t.me/priya_ai_neet_bot" },
        { status: 503 }
      );
    }

    // Try gemini-2.5-flash first, fall back to gemini-2.0-flash
    const models = ["gemini-2.5-flash", "gemini-2.0-flash"];
    let lastError = "";

    for (const model of models) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: SYSTEM_PROMPT + "\n\nStudent's question: " + message }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        const data = await res.json();

        // Check for API-level errors
        if (data.error) {
          lastError = `Gemini ${model} error: ${data.error.message || JSON.stringify(data.error)}`;
          console.error(lastError);
          continue; // try next model
        }

        // Check for content safety blocks
        if (data.candidates?.[0]?.finishReason === "SAFETY") {
          return NextResponse.json({
            reply: "Yeh question NEET Biology se related nahi lag raha. Kya aap NCERT Class 11 ya 12 Biology se related koi aur question puch sakte hain?",
          });
        }

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (reply) {
          return NextResponse.json({ reply });
        }

        lastError = `Gemini ${model} returned no text. Response: ${JSON.stringify(data).slice(0, 500)}`;
        console.error(lastError);
        continue;
      } catch (fetchErr) {
        lastError = `Gemini ${model} fetch failed: ${fetchErr}`;
        console.error(lastError);
        continue;
      }
    }

    // All models failed
    console.error("All Gemini models failed. Last error:", lastError);
    return NextResponse.json(
      {
        reply: "Priya AI temporarily unavailable. Please try on Telegram: t.me/priya_ai_neet_bot",
        debug: process.env.NODE_ENV === "development" ? lastError : undefined,
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("Priya AI route error:", error);
    return NextResponse.json(
      { reply: "Kuch error aa gaya. Please try again ya Telegram pe pucho: t.me/priya_ai_neet_bot" },
      { status: 500 }
    );
  }
}
