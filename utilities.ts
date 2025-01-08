import * as questions from './question.json';

export const getRandomQuestion = (category: string) => {
  const questionCategory = category.toLowerCase();
  const randomIndex = Math.floor(Math.random() * questions[questionCategory].length);

  return questions[questionCategory][randomIndex];
}