export type Question = {
  question: string;
  options: Array<string>;
  correctOption: number;
};

export type QuestionsSet = {
  skill: string;
  questions: Array<Question>;
};
