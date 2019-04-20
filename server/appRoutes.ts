import express from "express";
import socketio from "socket.io";

import { Controller } from "./appController";

export class Router {

    constructor(
        public app: express.Application, 
        public controller: Controller,
        public socketio: socketio.Server) 
    {

        this.app = app;
        this.controller = controller;
    }
    
    public route(): void {
        
        // Probably will be deleted

        /**

        this.app
            .route('/start-new-game')
            .get(this.controller.startNewGame);

        this.app
            .route('/questions-api')
            .get(this.controller.sendQuestions);

        this.app
            .route('/validate-answer/:answerId')
            .get(this.controller.validate);
        
        this.app
            .route('/*')
            .get((req, res) => {
                res.status(404);
                res.send("Page not found, sorry");
            });

        */
    }
}