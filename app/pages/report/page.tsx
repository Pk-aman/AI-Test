"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Result = {
  skill: string;
  question: string;
  options: string[];
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
};

export default function Report() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  // Only mark as mounted after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  // Now we can safely access localStorage
  const storedResults = localStorage.getItem("testResults");
  const storedTime = localStorage.getItem("testTime");

  if (!storedResults) {
    router.push("/");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const results: Result[] = JSON.parse(storedResults);
  const testTime = Number(storedTime) || 0;

  const totalQuestions = results.length;
  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  const skillWiseResults = results.reduce((acc, result) => {
    if (!acc[result.skill]) {
      acc[result.skill] = { correct: 0, total: 0, questions: [] };
    }
    acc[result.skill].total++;
    if (result.isCorrect) acc[result.skill].correct++;
    acc[result.skill].questions.push(result);
    return acc;
  }, {} as Record<string, { correct: number; total: number; questions: Result[] }>);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const handleDownload = () => {
    window.print();
  };

  const getGrade = () => {
    const score = Number(percentage);
    if (score >= 90)
      return { grade: "A+", color: "text-green-600", bgColor: "bg-green-50" };
    if (score >= 80)
      return { grade: "A", color: "text-green-500", bgColor: "bg-green-50" };
    if (score >= 70)
      return { grade: "B", color: "text-blue-600", bgColor: "bg-blue-50" };
    if (score >= 60)
      return { grade: "C", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    return { grade: "F", color: "text-red-600", bgColor: "bg-red-50" };
  };

  const { grade, color, bgColor } = getGrade();

  const getOptionLabel = (index: number) => String.fromCharCode(64 + index);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div
          ref={reportRef}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
              🎓 Test Report Card
            </h1>
            <p className="text-center text-indigo-100 text-lg">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="p-8 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm font-semibold mb-1">
                  Total Questions
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {totalQuestions}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-semibold mb-1">
                  Correct
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {correctAnswers}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                <h3 className="text-gray-500 text-sm font-semibold mb-1">
                  Incorrect
                </h3>
                <p className="text-3xl font-bold text-red-600">
                  {incorrectAnswers}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                <h3 className="text-gray-500 text-sm font-semibold mb-1">
                  Time Taken
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {formatTime(testTime)}
                </p>
              </div>
            </div>

            {/* Score Section */}
            <div
              className={`${bgColor} border-2 ${color.replace(
                "text-",
                "border-"
              )} p-8 rounded-xl text-center mb-6`}
            >
              <h2 className="text-2xl text-gray-700 mb-3">Your Final Score</h2>
              <div className="flex items-center justify-center gap-8">
                <div>
                  <p className={`text-7xl font-black ${color}`}>
                    {percentage}%
                  </p>
                </div>
                <div
                  className={`${color.replace(
                    "text-",
                    "bg-"
                  )} text-white px-8 py-4 rounded-2xl`}
                >
                  <p className="text-sm font-semibold">Grade</p>
                  <p className="text-5xl font-black">{grade}</p>
                </div>
              </div>
            </div>

            {/* Skill-wise Performance */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                📊 Skill-wise Performance
              </h2>
              <div className="space-y-4">
                {Object.entries(skillWiseResults).map(([skill, data]) => {
                  const skillPercentage = (
                    (data.correct / data.total) *
                    100
                  ).toFixed(0);
                  return (
                    <div key={skill} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg text-gray-800">
                          {skill}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">
                            {data.correct}/{data.total} Correct
                          </span>
                          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                            {skillPercentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            Number(skillPercentage) >= 70
                              ? "bg-green-500"
                              : Number(skillPercentage) >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${skillPercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Toggle Details Button */}
          <div className="px-8 pb-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {showDetails ? "▼ Hide" : "▶ Show"} Detailed Answer Review
            </button>
          </div>

          {/* Detailed Questions Review */}
          {showDetails && (
            <div className="p-8 bg-gray-50">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                📝 Detailed Answer Review
              </h2>

              {Object.entries(skillWiseResults).map(([skill, data]) => (
                <div key={skill} className="mb-8">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-t-xl">
                    <h3 className="text-2xl font-bold">{skill}</h3>
                    <p className="text-indigo-100">
                      {data.correct} out of {data.total} correct
                    </p>
                  </div>

                  <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-6">
                    {data.questions.map((result, qIndex) => {
                      const questionNumber =
                        results.findIndex((r) => r === result) + 1;

                      return (
                        <div
                          key={qIndex}
                          className={`border-2 rounded-xl p-6 ${
                            result.isCorrect
                              ? "border-green-300 bg-green-50"
                              : "border-red-300 bg-red-50"
                          }`}
                        >
                          {/* Question Header */}
                          <div className="flex items-start gap-3 mb-4">
                            <span className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold">
                              Q{questionNumber}
                            </span>
                            {result.isCorrect ? (
                              <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                                ✓ Correct
                              </span>
                            ) : (
                              <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                                ✗ Incorrect
                              </span>
                            )}
                          </div>

                          {/* Question Text */}
                          <p className="text-lg font-semibold text-gray-800 mb-5">
                            {result.question}
                          </p>

                          {/* All 4 Options with Color Coding */}
                          {result.options && result.options.length > 0 ? (
                            <div className="space-y-3 mb-5">
                              {result.options.map((option, optionIndex) => {
                                const optionNumber = optionIndex + 1;
                                const isUserAnswer =
                                  result.selectedAnswer === optionNumber;
                                const isCorrectAnswer =
                                  result.correctAnswer === optionNumber;

                                let optionClass =
                                  "bg-white border-2 border-gray-300";
                                let badgeElement = null;

                                if (isCorrectAnswer) {
                                  optionClass =
                                    "bg-green-100 border-2 border-green-500";
                                  badgeElement = (
                                    <span className="text-green-700 font-bold text-sm whitespace-nowrap">
                                      ✓ Correct Answer
                                    </span>
                                  );
                                } else if (isUserAnswer && !result.isCorrect) {
                                  optionClass =
                                    "bg-red-100 border-2 border-red-500";
                                  badgeElement = (
                                    <span className="text-red-700 font-bold text-sm whitespace-nowrap">
                                      Your Answer
                                    </span>
                                  );
                                }

                                return (
                                  <div
                                    key={optionIndex}
                                    className={`${optionClass} rounded-lg p-4 flex items-start gap-3 transition-all`}
                                  >
                                    <span className="font-bold text-gray-700 min-w-[35px] text-base">
                                      {getOptionLabel(optionNumber)}.
                                    </span>
                                    <span className="flex-1 text-gray-800 text-base leading-relaxed">
                                      {option}
                                    </span>
                                    {badgeElement}
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}

                          {/* Answer Summary */}
                          <div className="bg-white rounded-lg p-4 border-t-2 border-gray-300">
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 font-medium">
                                  Your Answer:
                                </span>
                                <span
                                  className={`font-bold text-base ${
                                    result.isCorrect
                                      ? "text-green-700"
                                      : "text-red-700"
                                  }`}
                                >
                                  Option {getOptionLabel(result.selectedAnswer)}
                                </span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 font-medium">
                                  Correct Answer:
                                </span>
                                <span className="font-bold text-base text-green-700">
                                  Option {getOptionLabel(result.correctAnswer)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 print:hidden">
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition shadow-lg flex items-center justify-center gap-2"
          >
            📥 Download Report
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("testResults");
              localStorage.removeItem("testTime");
              router.push("/");
            }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center gap-2"
          >
            🔄 Take Another Test
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 rounded-xl font-bold text-lg hover:from-gray-700 hover:to-gray-800 transition shadow-lg flex items-center justify-center gap-2"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .bg-gradient-to-r,
          .bg-gradient-to-br {
            background: #4f46e5 !important;
          }
        }
      `}</style>
    </div>
  );
}
