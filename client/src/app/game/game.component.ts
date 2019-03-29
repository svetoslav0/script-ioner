import { Component, OnInit } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { ApiService } from './http.service';
import { IQuestion } from './interfaces/IQuestion';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  questionsReceived: IQuestion[];
  currentQuestion: IQuestion;
  questionsAsked: number = 0;
  isCurrectAnswerCorrect = true;
  message: string = "";
  rightAnswer: string = "";

  timer: Subscription;
  seconds: number = 0;
  minutes: number = 3;
  leadingZeroSec: string = "";
  leadingZeroMin: string = "";
  
  gameWon: boolean = false;
  gameIsOver: boolean = false;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
      this.getQuestions().then(() => {
        this.startTimer();
        this.loadQuestion();
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
    this.gameIsOver = true;
    this.message = "Sorry, better luck next time...";
  }

  loadQuestion(): void {
    this.currentQuestion = {
      id: this.questionsReceived[this.questionsAsked].id,
      question: this.questionsReceived[this.questionsAsked].question,
      answers: this.questionsReceived[this.questionsAsked].answers
    }

    this.questionsAsked++;
    this.answersShuffle();
  }

  answersShuffle(): void {
    let currentIndex: number = this.currentQuestion.answers.length;
  
    while (0 !== currentIndex) {
  
      let randomIndex: number = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      let temporaryValue: string = this.currentQuestion.answers[currentIndex].answer;
      let temporaryId: number = +this.currentQuestion.answers[currentIndex].id;
      
      this.currentQuestion.answers[currentIndex] = {
        id: this.currentQuestion.answers[randomIndex].id,
        answer: this.currentQuestion.answers[randomIndex].answer
      }

      this.currentQuestion.answers[randomIndex] = {
        id: temporaryId,
        answer: temporaryValue
      }
    }
  }

  answer(answer: string): void {
    this.validateAnswer(answer).then(() => {
      if(this.isCurrectAnswerCorrect) { // If the answer is correct
        if (this.questionsAsked >= this.questionsReceived.length) { // If the game is won
          this.stopTimer();
          this.message = "Congrats! You won!";
        } else {
          this.loadQuestion();
        }
      } else { // If the answer was incorrect
        this.stopTimer();
        console.log('incorrect...');
      }
    });
  }

  getQuestions(): Promise<IQuestion[]> {
    return new Promise((resolve, reject) => {
      this.api
        .reqQuestions()
        .subscribe((data: IQuestion[]) => {
          this.questionsReceived = data;
          console.log(data);
          resolve();
        }, err => {
          console.log(err);
        })
    });
  }

  validateAnswer (answerId: string) {
    return new Promise((resolve, reject) => {
      this.api
        .validateAnswer(answerId)
        .subscribe((response) => {
          if(response.isCorrect){
            this.isCurrectAnswerCorrect = true;
            resolve();
          } else {
            this.isCurrectAnswerCorrect = false;
            //this.rightAnswer = response.rightAnswer;
            resolve();
          }
        }, err => {
          console.log(err);
        });
    });
  }
}
