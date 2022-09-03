import { Component } from '@angular/core';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
})
export class DriversComponent {
  constructor(){}

  heading = 'Drivers';
  type = {'isDriver': true};

  ngOnInit(): void {
  }

}
