import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { WebSocketService } from './../web-socket.service';

import { IPrimaryData } from "./interfaces/IPrimaryData";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  showErrors: boolean = false;
  errorMsg = "";

  @Input() settings: IPrimaryData = {
    gameStarted: false,
    username: ""
  };

  @Output() settingsArranged: EventEmitter<IPrimaryData> = new EventEmitter<IPrimaryData>();

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
  }

  startGame(username: string){
    
    if (username.length != 0) {
      this.showErrors = false;
      this.settings = {
        gameStarted: true,
        username: username
      }
      
      this.webSocketService.emit('join', this.settings);

      this.webSocketService.listen('username-exists').subscribe((usernameExists: boolean) => {
        if (!usernameExists) {
          this.settingsArranged.emit(this.settings);
        } else {
          this.showErrors = true;
          this.errorMsg = "A user with that Username already exists";
        }
      })
      
    } else {
      this.showErrors = true;
      this.errorMsg = "The Username field is required";
    }
  }

}