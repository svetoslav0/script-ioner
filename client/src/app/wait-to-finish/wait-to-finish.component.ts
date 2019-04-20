import { Component, OnInit, Input } from '@angular/core';

import { IPlayer } from '../Interfaces/IPlayer';
import { IGameData } from '../Interfaces/IGameData';

@Component({
  selector: 'app-wait-to-finish',
  templateUrl: './wait-to-finish.component.html',
  styleUrls: ['./wait-to-finish.component.css']
})
export class WaitToFinishComponent implements OnInit {

  @Input() players: IPlayer[];
  @Input() gameData: IGameData;

  currentPlayer: IPlayer;

  constructor() { }

  ngOnInit() {
    this.currentPlayer = this.players.filter((player) => {
      return player.id == this.gameData.playerId;
    })[0];
  }

}
