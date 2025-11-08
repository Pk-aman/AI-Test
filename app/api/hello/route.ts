import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://api.perplexity.ai",
});

export async function GET() {
  try {
    const response = await openai.chat.completions.create({
      model: "sonar-pro",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 512,
      stream: false,
    });
    console.log(
      "Response from Perplexity API:",
      response.choices[0].message.content
    );
    return NextResponse.json(
      { message: "GET", response: response.choices[0].message.content },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error querying Perplexity API:", error);
  }
}

export async function POST(request: Request) {
  const message = await request.json();
  console.log("body", message);
  try {
    const response = await openai.chat.completions.create({
      model: "sonar-pro",
      messages: [{ role: "user", content: message }],
      max_tokens: 512,
      stream: false,
    });
    return NextResponse.json(
      { response: response.choices[0].message.content },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error querying Perplexity API:", error);
  }
}
