import express from "express";
import { Controller } from "./appController";

export class Router {

    constructor(
        public app: express.Application, 
        public controller: Controller) 
    {

        this.app = app;
        this.controller = controller;
    }
    
    public route(): void {
        this.app
            .route('/questions-api')
            .get(this.controller.getRandQuestions); // TODO: call the specific controller

        this.app
            .route('/validate-answer/:answerId')
            .get(this.controller.validate); // TODO: call the specific controller
        
        this.app
            .route('/*')
            .get((req, res) => {
                res.status(404);
                res.send("Page not found, sorry");
            });
    }
}