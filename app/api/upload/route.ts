import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Use secure server-side key
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("body: ", body);

    //     const response = await openai.chat.completions.create({
    //       model: "sonar-pro", // Use valid model name (not sonar-pro)
    //       messages: [
    //         {
    //           role: "user",
    //           content: [
    //             {
    //               type: "text",
    //               text: `Create 1 multiple-choice questions for each of the following skills: ${body.skills}. Each question should include 4 options and specify the correct one. Format the output strictly as JSON using this structure:
    //                       [
    //                         {
    //                           "skill": "string",
    //                           "questions": [
    //                             {
    //                               "question": "string",
    //                               "options": ["option1", "option2", "option3", "option4"],
    //                               "correctOption": 1
    //                             }
    //                           ]
    //                         },
    //                       ]
    //                     Assume the user has around ${body.experience} years of professional experience in these technologies.
    // `,
    //             },
    //           ],
    //         },
    //       ],
    //       max_tokens: 28000,
    //     });

    //     if (!response.choices[0].message.content) {
    //       throw new Error("No content in OpenAI response");
    //     }

    //     console.log(response.choices[0].message.content);

    //     return NextResponse.json({
    //       response: JSON.parse(response.choices[0].message.content),
    //       status: 200,
    //     });
    return NextResponse.json({
      response: [
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
      ],
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
