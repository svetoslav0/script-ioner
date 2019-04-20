import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-wait-to-join',
  templateUrl: './wait-to-join.component.html',
  styleUrls: ['./wait-to-join.component.css']
})
export class WaitToJoinComponent implements OnInit {

  @Input() username: string;

  constructor() { }

  ngOnInit() {
  }

}
