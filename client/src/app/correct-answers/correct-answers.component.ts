import { Component, OnInit, Input } from '@angular/core';

import { IPlayer } from '../Interfaces/IPlayer';
import { IGameData } from '../Interfaces/IGameData';
import { IGameResults } from '../Interfaces/IGameResults';

@Component({
  selector: 'app-correct-answers',
  templateUrl: './correct-answers.component.html',
  styleUrls: ['./correct-answers.component.css']
})
export class CorrectAnswersComponent implements OnInit {

  @Input() gameData: IGameData;
  @Input() gameResults: IGameResults;
  givenAnswers: number[] = [];

  constructor() { }

  ngOnInit() {
    const thisPlayer: IPlayer = this.gameResults.players.filter((player) => { 
        return player.id == this.gameData.playerId;
    })[0];

    this.givenAnswers = thisPlayer.markedAnswers;
  }

}
