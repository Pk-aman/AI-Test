"use client";

import { useRouter } from "next/navigation";
import { QuestionsStore } from "../../feature/store";
import { useEffect, useState } from "react";

export default function TestDetails() {
  const router = useRouter();
  const store = QuestionsStore();
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    if (store.questionsSet.length === 0) {
      router.push("/");
      return;
    }
    const total = store.questionsSet.reduce(
      (acc, set) => acc + set.questions.length,
      0
    );
    setTotalQuestions(total);
  }, [store.questionsSet, router]);

  const handleStartTest = () => {
    router.push("/pages/test");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Test Details
        </h1>

        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Skills Covered
            </h2>
            <div className="flex flex-wrap gap-2">
              {store.questionsSet.map((set) => (
                <span
                  key={set.skill}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full"
                >
                  {set.skill} ({set.questions.length} questions)
                </span>
              ))}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Questions:{" "}
              <span className="text-green-600">{totalQuestions}</span>
            </h2>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Instructions
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Each question has 4 options with one correct answer</li>
              <li>Select your answer and click Next to proceed</li>
              <li>You cannot go back to previous questions</li>
              <li>Timer will show your elapsed time</li>
              <li>Submit the test after answering all questions</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleStartTest}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition"
        >
          Start Test Now
        </button>
      </div>
    </div>
  );
}
