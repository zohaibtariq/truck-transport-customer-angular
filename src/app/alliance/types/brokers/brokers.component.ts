import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-brokers',
  templateUrl: './brokers.component.html',
})
export class BrokersComponent implements OnInit {

  constructor(){ }

  heading = 'Brokers';
  type = {'isBroker': true};

  ngOnInit(): void {
  }

}
