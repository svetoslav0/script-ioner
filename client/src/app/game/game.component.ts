import { Component, OnInit, Input } from '@angular/core';
import { timer, Subscription } from 'rxjs';

import { WebSocketService } from './../web-socket.service';

import { IGameData } from '../Interfaces/IGameData';
import { IQuestion } from '../Interfaces/IQuestion';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  
  @Input() username: string;
  @Input() gameData: IGameData;
  @Input() currentQuestion: IQuestion;

  totalQuestions: number;
  

  questionsReceived: IQuestion[];
  questionsAsked: number = 1;
  message: string = "";
  rightAnswer: string = "";

  timer: Subscription;
  seconds: number;
  minutes: number;
  leadingZeroSec: string = "";
  leadingZeroMin: string = "";
  
  gameWon: boolean = false;
  gameIsOver: boolean = false;

  constructor(
    private webSocketService: WebSocketService
  ) { }

  ngOnInit() {
    // Set the timer when the Game begins 
    this.seconds = this.gameData.beginTime.seconds;
    this.minutes = this.gameData.beginTime.minutes;

    // Start the timer
    this.startTimer();
    this.totalQuestions = this.gameData.totalQuestions;
    this.sendTimeLeft();
    
  }

  startTimer(): void {
    this.timer = timer(0, 1000)
      .subscribe(() => {
        this.seconds--;
        
        
        if(this.seconds < 0){
          this.minutes--;
          this.seconds = 59;
        }
        
        this.leadingZerosCheck();

        if(this.minutes <= 0 && this.seconds <= 0){
          this.stopTimer();
        }
      });
  }

  leadingZerosCheck(): void {
    if (this.seconds < 10){
      this.leadingZeroSec = "0";
    } else {
      this.leadingZeroSec = "";
    }

    if (this.minutes < 10) {
      this.leadingZeroMin = "0";
    } else {
      this.leadingZeroMin = "";
    }
  }

  stopTimer(): void {
    this.timer.unsubscribe();
    if (!this.gameIsOver) {
      this.webSocketService.emit('time-out', true);
    }
  }

  answer(answerId: string): void {
    const answer = {
      answerId,
      gameData: this.gameData
    };

    this.questionsAsked++;

    this.webSocketService.emit('answer', answer);

    this.webSocketService.listen('next-question').subscribe((question: IQuestion) => {
      this.currentQuestion = question;
    });
  }

  sendTimeLeft(): void {
    this.webSocketService.listen('time-left-request').subscribe(() => {
      let secondsLeft = this.minutes * 60 + this.seconds;
      this.gameIsOver = true;
      this.webSocketService.emit('time-left-response', secondsLeft);
    })
  }
}
