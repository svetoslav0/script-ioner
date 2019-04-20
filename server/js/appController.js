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
var uuid_1 = require("uuid");
var Game_1 = require("./game/Game");
var Player_1 = require("./game/Player");
var Controller = /** @class */ (function () {
    function Controller(factory, io) {
        this.factory = factory;
        this.io = io;
        this.games = [];
        this.gameQuestions = []; // DEPRECATED
        this.repository = factory.createRepository();
        this.run = this.run.bind(this);
        this.joinEvent = this.joinEvent.bind(this);
        this.answerEvent = this.answerEvent.bind(this);
        this.destroyGame = this.destroyGame.bind(this);
        this.timeOutEvent = this.timeOutEvent.bind(this);
        this.disconnectEvent = this.disconnectEvent.bind(this);
    }
    Controller.prototype.run = function () {
        var _this = this;
        this.io.on('connection', function (socket) {
            console.log('Socket connection made.');
            // 'Join the game' event  
            socket.on('join', function (userData) {
                _this.joinEvent(socket, userData);
            });
            // 'Answer' event
            socket.on('answer', function (answer) {
                _this.answerEvent(socket, answer);
            });
            // 'Time out' event 
            socket.on('time-out', function (timeIsOver) {
                _this.timeOutEvent(socket, timeIsOver);
            });
            // 'Disconnect' event
            socket.on('disconnect', function () {
                _this.disconnectEvent(socket);
            });
        });
    };
    Controller.prototype.joinEvent = function (socket, userData) {
        var totalQuestions = +(process.env.QUESTIONS || 0);
        if (this.usernameExists(userData.username)) {
            socket.emit('username-exists', true);
        }
        else {
            socket.emit('username-exists', false);
            var playerId = socket.id;
            var player = new Player_1.Player(playerId, userData.username);
            var beginTime = {
                minutes: +(process.env.GAME_MINUTES || 0),
                seconds: +(process.env.GAME_SECONDS || 0)
            };
            if (this.games.length == 0) {
                var gameId = uuid_1.v4();
                var game = new Game_1.Game(this.factory, gameId);
                game.addPlayer(player);
                this.games.push(game);
                var gameData = { gameId: gameId, playerId: playerId, totalQuestions: totalQuestions, beginTime: beginTime };
                game.emitNewGame(this.io, socket, gameData);
            }
            else {
                var lastGameCreated = this.games[this.games.length - 1];
                var gameId = lastGameCreated.id;
                if (lastGameCreated.players.length == 1) {
                    lastGameCreated.addPlayer(player);
                    var gameData = { gameId: gameId, playerId: playerId, totalQuestions: totalQuestions, beginTime: beginTime };
                    lastGameCreated.emitStartGame(this.io, socket, gameData);
                }
                else {
                    var gameId_1 = uuid_1.v4();
                    var newGame = new Game_1.Game(this.factory, gameId_1);
                    newGame.addPlayer(player);
                    this.games.push(newGame);
                    var gameData = { gameId: gameId_1, playerId: playerId, totalQuestions: totalQuestions, beginTime: beginTime };
                    newGame.emitNewGame(this.io, socket, gameData);
                }
            }
        }
    };
    Controller.prototype.answerEvent = function (socket, userAnswer) {
        return __awaiter(this, void 0, void 0, function () {
            var validation, questionIndex, currentGame;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.validate(userAnswer.answerId)];
                    case 1:
                        validation = _a.sent();
                        questionIndex = 0;
                        currentGame = this.games.filter(function (game) { return game.id == userAnswer.gameData.gameId; })[0];
                        currentGame.players.filter(function (player) {
                            return player.id == userAnswer.gameData.playerId;
                        }).map(function (player) {
                            questionIndex = ++player.answeredQuestions;
                            player.addMarkedAnswer(+userAnswer.answerId);
                            if (validation.isCorrect) {
                                player.score += +(process.env.POINTS_PER_RIGHT_ANSWER || 0);
                            }
                        });
                        if (questionIndex >= +(process.env.QUESTIONS || 0)) {
                            socket.emit('time-left-request');
                            socket.on('time-left-response', function (totalSeconds) {
                                currentGame.players
                                    .filter(function (player) { return player.id == userAnswer.gameData.playerId; })
                                    .map(function (player) { player.score += totalSeconds; });
                                if (currentGame.isSomeonePlaying()) {
                                    socket.emit('wait-to-finish', currentGame.players);
                                }
                                else {
                                    currentGame.emitResults(_this.io, socket);
                                    /**
                                    const results: IGameResults = {
                                        players: currentGame.players,
                                        gameQuestions: currentGame.gameQuestions
                                    }
                
                                    socket.join(userAnswer.gameData.gameId);
                                    this.io.in(userAnswer.gameData.gameId).emit('show-results', results); */
                                    _this.destroyGame(userAnswer.gameData.gameId);
                                }
                            });
                        }
                        else {
                            currentGame.emitNextQuestion(socket, userAnswer.gameData.playerId);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.timeOutEvent = function (socket, timeIsOver) {
        var game = this.games.filter(function (currentGame) {
            return currentGame.players.filter(function (currentPlayer) {
                if (currentPlayer.id == socket.id) {
                    currentPlayer.timeOver = true;
                    return currentPlayer;
                }
                return null;
            })[0];
        })[0];
        game.emitResults(this.io, socket);
        /**
        const results: IGameResults = {
            players: game.players,
            gameQuestions: game.gameQuestions
        }

        socket.join(game.id);
        this.io.in(game.id).emit('show-results', results);
        */
        if (game.isSomeonePlaying() == false && timeIsOver) {
            this.destroyGame(game.id);
        }
    };
    Controller.prototype.disconnectEvent = function (socket) {
        console.log("[disconnection] User with ID: " + socket.id + " disconnected!");
        this.disconnectPlayer(socket.id);
        var gameFound = false;
        for (var i = 0; i < this.games.length; i++) {
            for (var j = 0; j < this.games[i].players.length; j++) {
                if (this.games[i].players[j].id == socket.id) {
                    var searchedGame = this.games[i];
                    searchedGame.emitResults(this.io, socket);
                    /**
                    const quesitonsWithCorrectAnswers = this.
                    const results: IGameResults = {
                        players: searchedGame.players,
                        gameQuestions: this.getCorrectAnswers()
                    }

                    socket.join(searchedGame.id);
                    this.io.in(searchedGame.id).emit('show-results', results);
                     */
                    this.destroyGame(searchedGame.id);
                    break;
                }
            }
            if (gameFound) {
                break;
            }
        }
    };
    Controller.prototype.getCorrectAnswers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ids;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ids = this.gameQuestions.map(function (q) { return q.id; });
                        return [4 /*yield*/, this.repository.fetchQuestionsWithCorrectAnswers(ids)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Destroy the game with its players
    Controller.prototype.destroyGame = function (gameId) {
        console.log("[destroy] Game with ID: " + gameId + " has been destroyed!");
        var pos = this.games.map(function (e) { return e.id; }).indexOf(gameId);
        this.games.splice(pos, 1);
    };
    Controller.prototype.disconnectPlayer = function (id) {
        this.games.forEach(function (game) {
            game.players.map(function (player) {
                if (player.id == id) {
                    player.isConnected = false;
                }
            });
        });
    };
    // Chech if that username exists in the entire application
    Controller.prototype.usernameExists = function (username) {
        var usernameExists = false;
        // Loop through all Games and all Player and try to find user with that name
        for (var i = 0; i < this.games.length; i++) {
            var currentGame = this.games[i];
            for (var j = 0; j < currentGame.players.length; j++) {
                var currentPlayer = currentGame.players[j];
                if (currentPlayer.username == username) {
                    usernameExists = true;
                    break;
                }
            }
            if (usernameExists) {
                break;
            }
        }
        return usernameExists;
    };
    return Controller;
}());
exports.Controller = Controller;
