import { Component, OnInit, ViewChild } from '@angular/core';

import { WebSocketService } from './web-socket.service';

import { Application } from './Application';
import { WelcomeComponent } from './welcome/welcome.component';

import { IPlayer } from './Interfaces/IPlayer';
import { IGameData } from './Interfaces/IGameData';
import { IQuestion } from './Interfaces/IQuestion';
import { IGameResults } from './Interfaces/IGameResults';
import { IPrimaryData } from './welcome/interfaces/IPrimaryData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  @ViewChild(WelcomeComponent) child;

  title: string = 'client';
  settings: IPrimaryData = {
    gameStarted: false,
    username: ""
  };

  question: IQuestion;
  gameData: IGameData;
  players: IPlayer[] = [];
  gameResults: IGameResults;

  app: Application;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.app = new Application();
    
    this.init();
    this.getGameData();
    this.endGame();
  }
  
  init(): void {
    this.app.getWelcomePage();

    this.webSocketService.listen('game-created').subscribe(() => {
      this.app.getWaitToJoinPage();

      console.log('[game-created] event fired');
    });

    this.webSocketService.listen('game-started').subscribe((question: IQuestion) => {
      this.app.getGamePage();
      
      this.question = question;
      
      console.log('[game-started] event fired');
    })
  }

  gameStartHandler($event: IPrimaryData): void {
    this.settings = $event;
    
    this.app.getWaitToJoinPage();
  }
  
  getGameData(): void {
    this.webSocketService.listen('game-data').subscribe((gameData: IGameData) => {
      this.gameData = gameData;
    });
  }

  endGame(): void {
    this.webSocketService.listen('wait-to-finish').subscribe((players: IPlayer[]) => {
      this.app.getWaitToFinishPage();
      this.players = players;
    });

    this.webSocketService.listen('show-results').subscribe((gameResults: IGameResults) => {
      this.app.getResultsPage();
      this.gameResults = gameResults;
      this.players = gameResults.players;
      console.log(gameResults);
    });
  }

  showCorrectAnswersHandler(): void {
    this.app.getCorrectAnswersPage();
  }
}