import { RepositoryInterface } from "./interfaces/RepositoryInterface";
import { IQuestionFetched } from "../interfaces/IQuestionFetched";
import { IValidateResponse } from "../interfaces/IValidateResponse";


export class MongoRepository implements RepositoryInterface{
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
}