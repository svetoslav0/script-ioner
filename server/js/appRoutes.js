"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Router = /** @class */ (function () {
    function Router(app, controller) {
        this.app = app;
        this.controller = controller;
        this.app = app;
        this.controller = controller;
    }
    Router.prototype.route = function () {
        this.app
            .route('/questions-api')
            .get(this.controller.getRandQuestions); // TODO: call the specific controller
        this.app
            .route('/validate-answer/:answerId')
            .get(this.controller.validate); // TODO: call the specific controller
        this.app
            .route('/*')
            .get(function (req, res) {
            res.status(404);
            res.send("Page not found, sorry");
        });
    };
    return Router;
}());
exports.Router = Router;
