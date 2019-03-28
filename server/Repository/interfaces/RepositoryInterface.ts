import { IQuestionFetched } from "../../interfaces/IQuestionFetched";
import { IValidateResponse } from "../../interfaces/IValidateResponse";

export interface RepositoryInterface {
    connect(): void;
    fetchQuestions(): Promise<IQuestionFetched[]>;
    validate(answerId: string): Promise<IValidateResponse>;
}