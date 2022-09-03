import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bill-tos',
  templateUrl: './bill-tos.component.html',
})
export class BillTosComponent implements OnInit {

  constructor(){ }

  heading = 'Bill Tos';
  type = {'isBillTo': true};

  ngOnInit(): void {
  }

}
