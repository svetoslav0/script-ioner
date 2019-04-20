export interface IQuestionFetched {
    questionId: number,
    answerId: number,
    question: string,
    answer: string,
    isCorrect?: number
}