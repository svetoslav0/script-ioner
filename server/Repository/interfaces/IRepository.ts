import { IQuestionFetched } from "../../interfaces/IQuestionFetched";
import { IValidateResponse } from "../../interfaces/IValidateResponse";

export interface IRepository {
    connect(): void;
    fetchQuestions(): Promise<IQuestionFetched[]>;
    validate(answerId: string): Promise<IValidateResponse>;
    fetchQuestionsWithCorrectAnswers(questionIds: number[]): Promise<IQuestionFetched[]>;
}