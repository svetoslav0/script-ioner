"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player = /** @class */ (function () {
    function Player(id, username) {
        this.id = id;
        this.username = username;
        this.score = 0;
        this.answeredQuestions = 0;
        this.isConnected = true;
        this.timeOver = false;
        this.markedAnswers = [];
        console.log("[new-player] A new Player with ID: " + this.id + " has been generated.");
        this.addMarkedAnswer = this.addMarkedAnswer.bind(this);
        this.getMarkedAnswers = this.getMarkedAnswers.bind(this);
    }
    Player.prototype.addMarkedAnswer = function (answerId) {
        this.markedAnswers.push(answerId);
    };
    Player.prototype.getMarkedAnswers = function () {
        return this.markedAnswers;
    };
    return Player;
}());
exports.Player = Player;
