/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("body: ", body);

    const response = await openai.chat.completions.create({
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content:
            "You are a technical interview question generator. You MUST respond with ONLY valid JSON, no markdown formatting, no code blocks, no explanations. Start your response directly with [ and end with ].",
        },
        {
          role: "user",
          content: `Generate exactly 3 multiple-choice questions for EACH of the following skills: ${body.skills.join(
            ", "
          )}.

CRITICAL REQUIREMENTS:
1. Return ONLY raw JSON - no markdown code blocks, no \`\`\`json tags, no explanations
2. Start your response with [ and end with ]
3. Each question must have exactly 4 options
4. correctOption must be a number (1, 2, 3, or 4) indicating which option is correct
5. Tailor difficulty to ${body.experience} years of professional experience

JSON Structure (return ONLY this, nothing else):
[
  {
    "skill": "SkillName",
    "questions": [
      {
        "question": "Your question here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctOption": 2
      }
    ]
  }
]

Generate questions now for: ${body.skills.join(", ")}`,
        },
      ],
      max_tokens: 28000,
      temperature: 0.7,
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content in OpenAI response");
    }

    let content = response.choices[0].message.content.trim();
    console.log("Raw AI Response:", content);

    // Clean up common issues with LLM JSON responses
    // Remove markdown code blocks if present
    content = content.replace(/```json\s*/g, "");
    content = content.replace(/```\s*/g, "");

    // Remove any text before the first [ or after the last ]
    const firstBracket = content.indexOf("[");
    const lastBracket = content.lastIndexOf("]");

    if (firstBracket !== -1 && lastBracket !== -1) {
      content = content.substring(firstBracket, lastBracket + 1);
    }

    // Try to parse the JSON
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Attempted to parse:", content);

      // Fallback: Try to find JSON in the content
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Unable to extract valid JSON from response");
      }
    }

    // Validate the structure
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      throw new Error("Response is not a valid array or is empty");
    }

    // Validate each skill object
    for (const skillObj of parsedData) {
      if (!skillObj.skill || !Array.isArray(skillObj.questions)) {
        throw new Error("Invalid skill object structure");
      }

      for (const question of skillObj.questions) {
        if (
          !question.question ||
          !Array.isArray(question.options) ||
          question.options.length !== 4 ||
          typeof question.correctOption !== "number" ||
          question.correctOption < 1 ||
          question.correctOption > 4
        ) {
          throw new Error("Invalid question structure");
        }
      }
    }

    console.log("Successfully parsed and validated:", parsedData);

    return NextResponse.json({
      response: parsedData,
      status: 200,
    });
  } catch (error: any) {
    console.error("Error:", error);

    // Fallback to mock data if AI fails
    const mockData = [
      {
        skill: "React",
        questions: [
          {
            question: "What is the primary purpose of the React Virtual DOM?",
            options: [
              "To directly manipulate the browser's real DOM",
              "To optimize and minimize the number of real DOM updates",
              "To render server-side only components",
              "To create CSS-in-JS solutions",
            ],
            correctOption: 2,
          },
          {
            question:
              "Which React hook is used to manage side effects such as API calls or timers?",
            options: ["useState", "useEffect", "useMemo", "useRef"],
            correctOption: 2,
          },
          {
            question:
              "What is the correct way to pass data from a parent to a child component?",
            options: [
              "Using props",
              "Using useEffect",
              "Using Context API only",
              "Direct assignment",
            ],
            correctOption: 1,
          },
        ],
      },
    ];

    return NextResponse.json({
      response: mockData,
      status: 200,
      warning: `Using fallback data. Error: ${error.message}`,
    });
  }
}
