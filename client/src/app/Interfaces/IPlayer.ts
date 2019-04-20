export interface IPlayer {
    id: string;
    username: string;
    score: number;
    answeredQuestions: number;
    isConnected: boolean;
    timeOver: boolean;
    markedAnswers: number[]
}