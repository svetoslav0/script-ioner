import { IQuestion } from './IQuestion';
import { IPlayer } from './IPlayer';

export interface IGameResults {
    players: IPlayer[],
    gameQuestions: IQuestion[]
}