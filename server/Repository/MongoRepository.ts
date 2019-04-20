import { IRepository } from "./interfaces/IRepository";
import { IQuestionFetched } from "../interfaces/IQuestionFetched";
import { IValidateResponse } from "../interfaces/IValidateResponse";


export class MongoRepository implements IRepository{
    connect(): void {
        console.log('Ooops, I am not implemnted....!');
        throw new Error("Method not implemented.");
    }    
    
    fetchQuestions(): Promise<IQuestionFetched[]> {
        throw new Error("Method not implemented.");
    }
    
    validate(answerId: string): Promise<IValidateResponse> {
        throw new Error("Method not implemented.");
    }
    
    fetchQuestionsWithCorrectAnswers(questionIds: number[]): Promise<IQuestionFetched[]> {
        throw new Error("Method not implemented.");
    }
}