import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shippers',
  templateUrl: './shippers.component.html',
})
export class ShippersComponent implements OnInit {

  constructor(){ }

  heading = 'Shippers';
  type = {'isShipper': true};

  ngOnInit(): void {
  }

}
