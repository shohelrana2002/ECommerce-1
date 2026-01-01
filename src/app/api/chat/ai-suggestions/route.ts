import connectDB from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { message, role } = await req.json();
    const prompt = `You are a smart and professional delivery assistant chatbot.

You will receive:
- role: either "user" or "delivery_boy"
- last message: the last sent in the conversation

Your task:
• If role is "user", generate 3 short WhatsApp-style reply suggestions that a user might send to the delivery boy.
• If role is "delivery_boy", generate 3 short WhatsApp-style reply suggestions that a delivery boy might send to the user.

Rules:
- Replies must be relevant to the last message.
- Each reply must be short and natural (maximum 10 words).
- Use emojis naturally (maximum one emoji per reply).
- Do NOT use generic replies like "Okay" or "Thanks".
- Replies should be helpful, polite, and related to delivery status, location, timing, or assistance.
- Do NOT add numbering, explanations, or extra text.

Return ONLY five reply suggestions, separated by commas.
Role:${role}
last message:${message}
`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );
    const data = await response.json();
    const replyText = data?.candidates?.[0].content?.parts?.[0]?.text || "";
    const suggestions = replyText.split(",").map((s: string) => s.trim());
    return NextResponse.json(suggestions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Ai Suggestions Error:${error}` },
      { status: 500 }
    );
  }
}
