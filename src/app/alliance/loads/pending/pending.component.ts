import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {

  heading = 'Pending';
  status = 'pending';

  constructor(){ }

  ngOnInit(): void {
  }

}
