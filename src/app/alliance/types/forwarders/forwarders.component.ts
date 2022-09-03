import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forwarders',
  templateUrl: './forwarders.component.html',
})
export class ForwardersComponent implements OnInit {

  constructor(){ }

  heading = 'Forwarders';
  type = {'isForwarder': true};

  ngOnInit(): void {
  }

}
