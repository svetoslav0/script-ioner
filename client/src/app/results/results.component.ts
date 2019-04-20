import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { WebSocketService } from './../web-socket.service';

import { IPlayer } from '../Interfaces/IPlayer';
import { IGameData } from '../Interfaces/IGameData';
import { IQuestion } from '../Interfaces/IQuestion';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  @Input() gameData: IGameData;
  @Input() players: IPlayer[];
  @Input() questionsWithAnswers: IQuestion[];
  
  @Output() showCorrectAnswers: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.players.sort((a, b) => {
      return (a.score < b.score) ? 1 : -1;
    }).sort((a, b) => {
      return +b.isConnected - +a.isConnected; // (a.isConnected === b.isConnected) ? 0 : a.isConnected ? -1 : 1;
    });
  }

  getCorrectAnswers(): void {
    this.showCorrectAnswers.emit();
  }
}
