import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tendered',
  templateUrl: './tendered.component.html',
  styleUrls: ['./tendered.component.scss']
})
export class TenderedComponent implements OnInit {

  heading = 'Tendered';
  status = 'tender';

  constructor(){ }

  ngOnInit(): void {
  }

}
