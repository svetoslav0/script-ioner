import { RepositoryFactory } from "../Repository/RepositoryFactory";

import { Player } from "./Player";

import { IGameData } from "../interfaces/IGameData";
import { IRepository } from "../Repository/interfaces/IRepository";
import { IGameResults } from "../interfaces/IGameResults";
import { IQuestionFetched } from "../interfaces/IQuestionFetched";
import { IQuestionArranged } from "../interfaces/IQuestionArranged";

export class Game {
    gameQuestions: IQuestionArranged[] = [];
    questionsWithCorrectAnswers: IQuestionArranged[] = [];
    repository!: IRepository;
    players: Player[] = [];

    constructor(
        public factory: RepositoryFactory,
        public id: string
        ){
            this.repository = factory.createRepository();
            this.run();
            console.log(`[new-game] A new Game with ID: ${this.id} has been created.`);
            
            this.run = this.run.bind(this);
            this.emitResults = this.emitResults.bind(this);
            this.fetchQuestions = this.fetchQuestions.bind(this);
            this.arrangeQuestions = this.arrangeQuestions.bind(this);
            this.isSomeonePlaying = this.isSomeonePlaying.bind(this);
            this.fetchQuestionsWithAnswers = this.fetchQuestionsWithAnswers.bind(this);
         }

    public async run(): Promise<void> {
        await this.fetchQuestions();
    }

    public addPlayer(player: Player): void {
        this.players.push(player);
    }
    
    public emitNewGame(io: SocketIO.Server, socket: SocketIO.Socket, gameData: IGameData): void {
        console.log(`[player-joined] A Player with ID: ${gameData.playerId} has joined the Game with ID: ${gameData.gameId}.`);

        socket.join(gameData.gameId);
        io.in(gameData.gameId).emit('game-created');

        socket.emit('game-data', gameData);
    }

    public emitStartGame(io: SocketIO.Server, socket: SocketIO.Socket, gameData: IGameData): void {
        console.log(`[game-started] A Player with ID: ${gameData.playerId} has joined the Game with ID: ${gameData.gameId}.`);

        socket.join(gameData.gameId);
        io.in(gameData.gameId)
            .emit('game-started', this.answersShuffle(this.gameQuestions[0]));

        socket.emit('game-data', gameData);
    }

    public emitNextQuestion(socket: SocketIO.Socket, playerId: string): void {
        const questionIndex: number = this.players.filter((player) => { return player.id == playerId })[0].answeredQuestions;
        const nextQuestion: IQuestionArranged = this.gameQuestions[questionIndex];
        socket.emit('next-question', this.answersShuffle(nextQuestion));
    }

    public async emitResults(io: SocketIO.Server, socket: SocketIO.Socket): Promise<void> {
        await this.fetchQuestionsWithAnswers(this.gameQuestions.map(q => q.id));
        const results: IGameResults = {
            players: this.players,
            gameQuestions: this.questionsWithCorrectAnswers
        }


        socket.join(this.id);
        io.in(this.id).emit('show-results', results);
    }

    public isSomeonePlaying(): boolean {
        let isSomeonePlaying: boolean = false;
        this.players.forEach((player) => {
            if(player.answeredQuestions < +(process.env.QUESTIONS || 0) && player.isConnected && !player.timeOver) {
                isSomeonePlaying = true;
            }
        });

        return isSomeonePlaying;
    }

    private async fetchQuestions(): Promise<void> {
        let questionsFetched: IQuestionFetched[] = await this.repository.fetchQuestions(); // array of questions as they were fetched
        this.gameQuestions = this.arrangeQuestions(questionsFetched);
    }

    private async fetchQuestionsWithAnswers(ids: number[]): Promise<void> {
        let questionsFetched: IQuestionFetched[] = await this.repository.fetchQuestionsWithCorrectAnswers(ids);
        this.questionsWithCorrectAnswers = this.arrangeQuestions(questionsFetched);
    }

    private arrangeQuestions(questionsFetched: IQuestionFetched[]): IQuestionArranged[] {
        let questions: IQuestionArranged[] = [];

        // forEach through fetched questions to arrange them
        questionsFetched.forEach(currFetchedQuestion => {
            // check if the current question already exists in the array
            if (questions.filter(e => e.id == currFetchedQuestion.questionId).length != 0) {
                // if yes -> find the question and add the new answer with its id
                questions
                    .filter(e => e.id == currFetchedQuestion.questionId)
                    .map(e => e.answers.push({
                        id: currFetchedQuestion.answerId,
                        answer: currFetchedQuestion.answer,
                        isCorrect: currFetchedQuestion.isCorrect
                    }));
            } else {
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
    }

    private answersShuffle(question: IQuestionArranged): IQuestionArranged {
        let currentIndex: number = question.answers.length;

        while (currentIndex-- > 0) {

            let randomIndex: number = Math.floor(Math.random() * currentIndex);

            let temporaryValue: string = question.answers[currentIndex].answer;
            let temporaryId: number = +question.answers[currentIndex].id;

            question.answers[currentIndex] = {
                id: question.answers[randomIndex].id,
                answer: question.answers[randomIndex].answer
            }

            question.answers[randomIndex] = {
                id: temporaryId,
                answer: temporaryValue
            }
        }

        return question;
    }
}