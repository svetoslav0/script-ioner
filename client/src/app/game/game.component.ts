import { Component, OnInit } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { ApiService } from './http.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  currentQuestion;
  answersArr;
  isCurrectAnswerCorrect = true;
  message: string = "";
  rightAnswer: string = "";

  timer: Subscription;
  seconds: number = 10;
  minutes: number = 2;
  leadingZeroSec: string = "";
  leadingZeroMin: string = "";
  
  gameWon: boolean = false;
  gameLost: boolean = false;
  questionCounter: string;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.startNewGame()
      .then(() => {
        this.getQuestion();
        this.startTimer();
        this.printQuestionCounter();
      });
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
    this.gameLost = true;
    this.message = "Sorry, the right answer was " + this.rightAnswer;
  }

  printQuestionCounter(): void {
    this.questionCounter = `Question: X/X`;
  }

  answer(answer: string) {
    this.validateAnswer(answer).then(() => {
      if(this.isCurrectAnswerCorrect) {
        this.getQuestion();
        console.log('correct!');
      } else {
        this.gameLost = true;
        this.stopTimer();
        console.log('incorrect...');
      }
    });
  }

  startNewGame () {
    return new Promise((resolve, reject) => {
      this.api
        .startNewGame()
        .subscribe(() => {
          console.log('Game started');
          resolve();
        })
    })
  }

  getQuestion() {
    return new Promise((resolve, reject) => {
      this.api
        .reqQuestion()
        .subscribe((data) => {
          if(data.hasOwnProperty('noMoreQuestions')){
            if(data.noMoreQuestions) {
              this.message = "No more questions";
            }
            resolve();
          } else {
            this.currentQuestion = data;
            this.answersArr = [
              data.answer1,
              data.answer2,
              data.answer3,
              data.answer4
            ]
            console.log(data);
            resolve();
          }
        }, err => {
          console.log(err);
        })
    });
  }

  validateAnswer (answer: string) {
    return new Promise((resolve, reject) => {
      this.api
        .validateAnswer(encodeURIComponent(answer))
        .subscribe((response) => {
          if(response.isCorrect){
            // console.log("Correct!");
            this.isCurrectAnswerCorrect = true;
            resolve();
          } else {
            // console.log("Incorrect answer!");
            this.isCurrectAnswerCorrect = false;
            this.rightAnswer = response.rightAnswer;
            resolve();
          }
        }, err => {
          console.log(err);
        });
    });
  }
}
