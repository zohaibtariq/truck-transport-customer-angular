import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cancelled',
  templateUrl: './cancelled.component.html',
  styleUrls: ['./cancelled.component.scss']
})
export class CancelledComponent implements OnInit {

  heading = 'Cancelled';
  status = 'cancelled';

  constructor(){ }

  ngOnInit(): void {
  }

}
