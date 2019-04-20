"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Game = /** @class */ (function () {
    function Game(factory, id) {
        this.factory = factory;
        this.id = id;
        this.gameQuestions = [];
        this.questionsWithCorrectAnswers = [];
        this.players = [];
        this.repository = factory.createRepository();
        this.run();
        console.log("[new-game] A new Game with ID: " + this.id + " has been created.");
        this.run = this.run.bind(this);
        this.emitResults = this.emitResults.bind(this);
        this.fetchQuestions = this.fetchQuestions.bind(this);
        this.arrangeQuestions = this.arrangeQuestions.bind(this);
        this.isSomeonePlaying = this.isSomeonePlaying.bind(this);
        this.fetchQuestionsWithAnswers = this.fetchQuestionsWithAnswers.bind(this);
    }
    Game.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchQuestions()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.addPlayer = function (player) {
        this.players.push(player);
    };
    Game.prototype.emitNewGame = function (io, socket, gameData) {
        console.log("[player-joined] A Player with ID: " + gameData.playerId + " has joined the Game with ID: " + gameData.gameId + ".");
        socket.join(gameData.gameId);
        io.in(gameData.gameId).emit('game-created');
        socket.emit('game-data', gameData);
    };
    Game.prototype.emitStartGame = function (io, socket, gameData) {
        console.log("[game-started] A Player with ID: " + gameData.playerId + " has joined the Game with ID: " + gameData.gameId + ".");
        socket.join(gameData.gameId);
        io.in(gameData.gameId)
            .emit('game-started', this.answersShuffle(this.gameQuestions[0]));
        socket.emit('game-data', gameData);
    };
    Game.prototype.emitNextQuestion = function (socket, playerId) {
        var questionIndex = this.players.filter(function (player) { return player.id == playerId; })[0].answeredQuestions;
        var nextQuestion = this.gameQuestions[questionIndex];
        socket.emit('next-question', this.answersShuffle(nextQuestion));
    };
    Game.prototype.emitResults = function (io, socket) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchQuestionsWithAnswers(this.gameQuestions.map(function (q) { return q.id; }))];
                    case 1:
                        _a.sent();
                        results = {
                            players: this.players,
                            gameQuestions: this.questionsWithCorrectAnswers
                        };
                        socket.join(this.id);
                        io.in(this.id).emit('show-results', results);
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.isSomeonePlaying = function () {
        var isSomeonePlaying = false;
        this.players.forEach(function (player) {
            if (player.answeredQuestions < +(process.env.QUESTIONS || 0) && player.isConnected && !player.timeOver) {
                isSomeonePlaying = true;
            }
        });
        return isSomeonePlaying;
    };
    Game.prototype.fetchQuestions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var questionsFetched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.fetchQuestions()];
                    case 1:
                        questionsFetched = _a.sent();
                        this.gameQuestions = this.arrangeQuestions(questionsFetched);
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.fetchQuestionsWithAnswers = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var questionsFetched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.fetchQuestionsWithCorrectAnswers(ids)];
                    case 1:
                        questionsFetched = _a.sent();
                        this.questionsWithCorrectAnswers = this.arrangeQuestions(questionsFetched);
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.arrangeQuestions = function (questionsFetched) {
        var questions = [];
        // forEach through fetched questions to arrange them
        questionsFetched.forEach(function (currFetchedQuestion) {
            // check if the current question already exists in the array
            if (questions.filter(function (e) { return e.id == currFetchedQuestion.questionId; }).length != 0) {
                // if yes -> find the question and add the new answer with its id
                questions
                    .filter(function (e) { return e.id == currFetchedQuestion.questionId; })
                    .map(function (e) { return e.answers.push({
                    id: currFetchedQuestion.answerId,
                    answer: currFetchedQuestion.answer,
                    isCorrect: currFetchedQuestion.isCorrect
                }); });
            }
            else {
                // if no -> add the new question with the new answer
                questions.push({
                    id: currFetchedQuestion.questionId,
                    question: currFetchedQuestion.question,
                    answers: [{
                            id: currFetchedQuestion.answerId,
                            answer: currFetchedQuestion.answer,
                            isCorrect: currFetchedQuestion.isCorrect
                        }]
                });
            }
        });
        return questions;
    };
    Game.prototype.answersShuffle = function (question) {
        var currentIndex = question.answers.length;
        while (currentIndex-- > 0) {
            var randomIndex = Math.floor(Math.random() * currentIndex);
            var temporaryValue = question.answers[currentIndex].answer;
            var temporaryId = +question.answers[currentIndex].id;
            question.answers[currentIndex] = {
                id: question.answers[randomIndex].id,
                answer: question.answers[randomIndex].answer
            };
            question.answers[randomIndex] = {
                id: temporaryId,
                answer: temporaryValue
            };
        }
        return question;
    };
    return Game;
}());
exports.Game = Game;
