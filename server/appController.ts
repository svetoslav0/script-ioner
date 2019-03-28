import express from "express";
import { AppModel } from './appModel';
import * as Repository from "./Repository";

import { IQuestionFetched } from './interfaces/IQuestionFetched';
import { IQuestionArranged } from "./interfaces/IQuestionArranged";
import { IValidateResponse } from './interfaces/IValidateResponse';
import { RepositoryInterface } from "./Repository/interfaces/RepositoryInterface";


export class Controller {

    public async getRandQuestions(req: express.Request, res: express.Response): Promise<void> {
        const originalAdapter: string = process.env.DB_ADAPTER || "";
        const adapter = originalAdapter.charAt(0).toUpperCase() + originalAdapter.slice(1) + "Repository";
    
        const repository: RepositoryInterface = new (<any>Repository)[adapter]();

        // const model: AppModel = new AppModel();

        let questionsFetched: IQuestionFetched[] = await repository.fetchQuestions();    // array of questions as they were fetched
        let questionsArranged: IQuestionArranged[] = [];                            // array of questions as they should be send

        // forEach through fetched questions to arrange them
        questionsFetched.forEach(currentQuestion => {
            // check if the current question already exists in the array
            if (questionsArranged.filter(e => e.id == currentQuestion.questionId).length != 0) {
                // if yes -> find the question and add the new answer with its id
                questionsArranged
                    .filter(e => e.id == currentQuestion.questionId)
                    .map(e => e.answers.push({
                        id: currentQuestion.answerId,
                        answer: currentQuestion.answer
                    }));
            } else {
                // if no -> add the new question with the new answer
                questionsArranged.push({
                    id: currentQuestion.questionId,
                    question: currentQuestion.question,
                    answers: [{
                        id: currentQuestion.answerId,
                        answer: currentQuestion.answer
                    }]
                });
            }
        });

        
        res.send(questionsArranged);
    }

    public async validate(req: express.Request, res: express.Response): Promise<void> {
        //const model: AppModel = new AppModel();

        const originalAdapter: string = process.env.DB_ADAPTER || "";
        const adapter = originalAdapter.charAt(0).toUpperCase() + originalAdapter.slice(1) + "Repository";
    
        const repository: any = new (<any>Repository)[adapter]();


        let isCorrect: IValidateResponse = await repository.validate(req.params.answerId);

        res.send(isCorrect);
    }
}