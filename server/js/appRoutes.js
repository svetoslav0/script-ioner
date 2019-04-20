"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Router = /** @class */ (function () {
    function Router(app, controller, socketio) {
        this.app = app;
        this.controller = controller;
        this.socketio = socketio;
        this.app = app;
        this.controller = controller;
    }
    Router.prototype.route = function () {
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
    };
    return Router;
}());
exports.Router = Router;
