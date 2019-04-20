import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WaitToJoinComponent } from './wait-to-join/wait-to-join.component';
import { GameComponent } from './game/game.component';
import { WaitToFinishComponent } from './wait-to-finish/wait-to-finish.component';
import { ResultsComponent } from './results/results.component';
import { CorrectAnswersComponent } from './correct-answers/correct-answers.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    GameComponent,
    WaitToJoinComponent,
    ResultsComponent,
    WaitToFinishComponent,
    CorrectAnswersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
