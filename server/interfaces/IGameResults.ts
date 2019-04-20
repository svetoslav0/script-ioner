import { IQuestionArranged } from './IQuestionArranged';
import { Player } from '../game/Player';

export interface IGameResults {
    players: Player[],
    gameQuestions: IQuestionArranged[]
}