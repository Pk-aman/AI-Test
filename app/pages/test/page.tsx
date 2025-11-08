"use client";
import React from "react";
import { QuestionsStore } from "../../feature/store";
import { QuestionsSet, Question } from "@/app/utility/types";

function Test() {
  const store = QuestionsStore();

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4">
        {store.questionsSet.map((questionsSet: QuestionsSet, index: number) => (
          <div key={index}>
            <h1>{questionsSet.skill}</h1>
            {questionsSet.questions.map(
              (question: Question, qIndex: number) => (
                <div key={qIndex}>
                  <h2>{question.question}</h2>
                  <ul>
                    {question.options.map((option: string, oIndex: number) => (
                      <li key={oIndex}>{option}</li>
                    ))}
                  </ul>
                  <p>Correct Option: {question.correctOption}</p>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Test;
