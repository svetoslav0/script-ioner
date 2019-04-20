import { IGameTime } from './IGameTime';

export interface IGameData {
    gameId: string,
    playerId: string,
    totalQuestions?: number,
    beginTime?: IGameTime
}