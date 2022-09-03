import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminals',
  templateUrl: './terminals.component.html',
})
export class TerminalsComponent implements OnInit {

  constructor(){ }

  heading = 'Terminals';
  type = {'isTerminal': true};

  ngOnInit(): void {
  }

}
