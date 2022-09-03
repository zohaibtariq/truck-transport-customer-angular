import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss']
})
export class CompletedComponent implements OnInit {

  heading = 'Completed';
  status = 'completed';

  constructor(){ }

  ngOnInit(): void {
  }

}
