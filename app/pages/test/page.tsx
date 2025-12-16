"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuestionsStore } from "../../feature/store";

export default function Test() {
  const router = useRouter();
  const store = QuestionsStore();
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (store.questionsSet.length === 0) {
      router.push("/");
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [store.questionsSet, router]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentSkill = store.questionsSet[currentSkillIndex];
  const currentQuestion = currentSkill?.questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    const answersCopy = [...selectedAnswers];
    const globalIndex =
      store.questionsSet
        .slice(0, currentSkillIndex)
        .reduce((acc, set) => acc + set.questions.length, 0) +
      currentQuestionIndex;
    answersCopy[globalIndex] = optionIndex;
    setSelectedAnswers(answersCopy);
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentSkill.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSkillIndex < store.questionsSet.length - 1) {
      setCurrentSkillIndex(currentSkillIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmit = () => {
    const results = store.questionsSet.flatMap((skillSet, skillIdx) =>
      skillSet.questions.map((q, qIdx) => {
        const globalIdx =
          store.questionsSet
            .slice(0, skillIdx)
            .reduce((acc, set) => acc + set.questions.length, 0) + qIdx;
        return {
          skill: skillSet.skill,
          question: q.question,
          options: q.options, // ✅ ADDED THIS LINE
          selectedAnswer: selectedAnswers[globalIdx],
          correctAnswer: q.correctOption,
          isCorrect: selectedAnswers[globalIdx] === q.correctOption,
        };
      })
    );

    localStorage.setItem("testResults", JSON.stringify(results));
    localStorage.setItem("testTime", elapsedTime.toString());
    router.push("/pages/report");
  };

  const isLastQuestion =
    currentSkillIndex === store.questionsSet.length - 1 &&
    currentQuestionIndex === currentSkill?.questions.length - 1;

  const globalQuestionNumber =
    store.questionsSet
      .slice(0, currentSkillIndex)
      .reduce((acc, set) => acc + set.questions.length, 0) +
    currentQuestionIndex +
    1;

  const totalQuestions = store.questionsSet.reduce(
    (acc, set) => acc + set.questions.length,
    0
  );

  const globalIndex =
    store.questionsSet
      .slice(0, currentSkillIndex)
      .reduce((acc, set) => acc + set.questions.length, 0) +
    currentQuestionIndex;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Timer Header */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Question {globalQuestionNumber} of {totalQuestions}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Time Elapsed:</span>
          <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-mono text-lg font-semibold">
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      {/* Question Section */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
            {currentSkill?.skill}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {currentQuestion?.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectOption(index + 1)}
              className={`w-full text-left p-4 rounded-lg border-2 transition ${
                selectedAnswers[globalIndex] === index + 1
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
            >
              <span className="font-semibold mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswers[globalIndex] === undefined}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={selectedAnswers[globalIndex] === undefined}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Next Question →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
