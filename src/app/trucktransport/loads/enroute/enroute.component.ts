import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enroute',
  templateUrl: './enroute.component.html',
  styleUrls: ['./enroute.component.scss']
})
export class EnrouteComponent implements OnInit {

  heading = 'Enroute';
  status = 'enroute';

  constructor(){ }

  ngOnInit(): void {
  }

}
