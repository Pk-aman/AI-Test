import { create } from "zustand";
import { QuestionsSet } from "../utility/types";

type States = {
  questionsSet: Array<QuestionsSet>;
};

type Action = {
  fill: (questionsSet: Array<QuestionsSet>) => void;
  clear: () => void;
};

export const QuestionsStore = create<States & Action>()((set) => ({
  questionsSet: [],
  fill: (questionsSet: Array<QuestionsSet>) =>
    set(() => ({
      questionsSet: [...questionsSet],
    })),
  clear: () => set(() => ({ questionsSet: [] })),
}));
