import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Use secure server-side key
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export async function POST() {
  try {
    const response = await openai.chat.completions.create({
      model: "sonar-pro", // Use valid model name (not sonar-pro)
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Read this resume via url and return a json object, which contain skills as an array, experience in years. response format must be {skill: Array<string>, experience: number}Read this resume via url and return a json object, which contain skills as an array, experience in years. response format must be {skill: Array<string>, experience: number}",
            },
            {
              type: "file_url",
              file_url: {
                url: "https://drive.google.com/file/d/1jAwJuEHzHLgA43xXrhMy2q3EWu_AdMQD/view",
              },
            } as any,
          ],
        },
      ],
      max_tokens: 512,
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content in OpenAI response");
    }

    return NextResponse.json({
      response: JSON.parse(response.choices[0].message.content),
      status: 200,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({
      response: `Error: ${error.message}`,
      status: 500,
    });
  }
}
