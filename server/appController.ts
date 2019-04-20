import socketio from "socket.io";
import { v4 as uuid } from "uuid";

import { Game } from "./game/Game";
import { Player } from "./game/Player";
import { RepositoryFactory } from "./Repository/RepositoryFactory";

import { IGameData } from "./interfaces/IGameData";
import { IGameTime } from "./interfaces/IGameTime";
import { IRepository } from "./Repository/interfaces/IRepository";
import { IGameResults } from "./interfaces/IGameResults";
import { IAnswerFromUser } from "./interfaces/IAnswerFromUser";
import { IQuestionArranged } from "./interfaces/IQuestionArranged";
import { IValidateResponse } from "./interfaces/IValidateResponse";

export class Controller {

    repository!: IRepository;
    games: Game[] = [];

    gameQuestions: IQuestionArranged[] = []; // DEPRECATED

    constructor(
        public factory: RepositoryFactory,
        public io: socketio.Server
    ) {
        this.repository = factory.createRepository();

        this.run = this.run.bind(this);
        this.joinEvent = this.joinEvent.bind(this);
        this.answerEvent = this.answerEvent.bind(this);
        this.destroyGame = this.destroyGame.bind(this);
        this.timeOutEvent = this.timeOutEvent.bind(this);
        this.disconnectEvent = this.disconnectEvent.bind(this);
    }

    public run() {
        this.io.on('connection', (socket: socketio.Socket) => {
            console.log('Socket connection made.');

            // 'Join the game' event  
            socket.on('join', (userData) => {
                this.joinEvent(socket, userData);
            });

            // 'Answer' event
            socket.on('answer', (answer) => {
                this.answerEvent(socket, answer);
            });

            // 'Time out' event 
            socket.on('time-out', (timeIsOver: boolean) => {
                this.timeOutEvent(socket, timeIsOver);
            });

            // 'Disconnect' event
            socket.on('disconnect', () => {
                this.disconnectEvent(socket);
            });
        });
    }

    private joinEvent(socket: socketio.Socket, userData: any) {
        const totalQuestions: number = +(process.env.QUESTIONS || 0);


        if (this.usernameExists(userData.username)) {
            socket.emit('username-exists', true);
        } else {
            socket.emit('username-exists', false);

            const playerId: string = socket.id;
            const player: Player = new Player(playerId, userData.username);

            const beginTime: IGameTime = {
                minutes: +(process.env.GAME_MINUTES || 0),
                seconds: +(process.env.GAME_SECONDS || 0)
            };

            if (this.games.length == 0) {
                const gameId: string = uuid();
                const game = new Game(this.factory, gameId);
                game.addPlayer(player);
                this.games.push(game);
                
                const gameData: IGameData = { gameId, playerId, totalQuestions, beginTime };
                game.emitNewGame(this.io, socket, gameData);
            } else {
                const lastGameCreated: Game = this.games[this.games.length - 1];
                const gameId: string = lastGameCreated.id;

                if (lastGameCreated.players.length == 1) {

                    lastGameCreated.addPlayer(player);
                    const gameData: IGameData = { gameId, playerId, totalQuestions, beginTime };

                    lastGameCreated.emitStartGame(this.io, socket, gameData);
                    
                } else {
                    const gameId: string = uuid();
                    const newGame: Game = new Game(this.factory, gameId);

                    newGame.addPlayer(player);
                    this.games.push(newGame);

                    const gameData: IGameData = { gameId, playerId, totalQuestions, beginTime };
                    newGame.emitNewGame(this.io, socket, gameData);
                }
            }
        }
    }

    private async answerEvent(socket: socketio.Socket, userAnswer: IAnswerFromUser): Promise<void> {
        let validation: IValidateResponse = await this.repository.validate(userAnswer.answerId);
        let questionIndex = 0;

        // Find the game with received ID and there find the player with received ID
        const currentGame: Game = this.games.filter((game) => { return game.id == userAnswer.gameData.gameId })[0];

        currentGame.players.filter((player) => {
            return player.id == userAnswer.gameData.playerId;
        }).map((player) => {
            questionIndex = ++player.answeredQuestions;
            player.addMarkedAnswer(+userAnswer.answerId);
            if (validation.isCorrect) {
                player.score += +(process.env.POINTS_PER_RIGHT_ANSWER || 0);
            }
        });

        if (questionIndex >= +(process.env.QUESTIONS || 0)) {
            socket.emit('time-left-request');
            socket.on('time-left-response', (totalSeconds: number) => {
                currentGame.players
                    .filter((player) => { return player.id == userAnswer.gameData.playerId })
                    .map((player) => { player.score += totalSeconds });

                if (currentGame.isSomeonePlaying()) {
                    socket.emit('wait-to-finish', currentGame.players);
                } else {

                    currentGame.emitResults(this.io, socket);

                    /**
                    const results: IGameResults = {
                        players: currentGame.players,
                        gameQuestions: currentGame.gameQuestions
                    }

                    socket.join(userAnswer.gameData.gameId);
                    this.io.in(userAnswer.gameData.gameId).emit('show-results', results); */

                    this.destroyGame(userAnswer.gameData.gameId);
                }
            });
        } else {
            currentGame.emitNextQuestion(socket, userAnswer.gameData.playerId);
        }
    }

    private timeOutEvent(socket: socketio.Socket, timeIsOver: boolean) {

        const game: Game = this.games.filter((currentGame) => {
            return currentGame.players.filter((currentPlayer) => {
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
    }

    private disconnectEvent(socket: socketio.Socket): void {
        console.log(`[disconnection] User with ID: ${socket.id} disconnected!`);
        this.disconnectPlayer(socket.id);

        let gameFound: boolean = false;

        for (let i = 0; i < this.games.length; i++) {
            for (let j = 0; j < this.games[i].players.length; j++) {
                if (this.games[i].players[j].id == socket.id) {
                    const searchedGame: Game = this.games[i];

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
    }

    private async getCorrectAnswers() {
        let ids: number[] = this.gameQuestions.map(q => q.id);
        return await this.repository.fetchQuestionsWithCorrectAnswers(ids);
    }

    // Destroy the game with its players
    private destroyGame(gameId: string): void {
        console.log(`[destroy] Game with ID: ${gameId} has been destroyed!`);

        const pos = this.games.map((e) => { return e.id; }).indexOf(gameId);
        this.games.splice(pos, 1);
    }

    private disconnectPlayer(id: string): void {
        this.games.forEach((game) => {
            game.players.map((player) => {
                if (player.id == id) {
                    player.isConnected = false;
                }
            })
        })
    }

    // Chech if that username exists in the entire application
    private usernameExists(username: string): boolean {
        let usernameExists: boolean = false;

        // Loop through all Games and all Player and try to find user with that name
        for (let i: number = 0; i < this.games.length; i++) {
            let currentGame: Game = this.games[i];
            for (let j: number = 0; j < currentGame.players.length; j++) {
                let currentPlayer: Player = currentGame.players[j];
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
    }
}