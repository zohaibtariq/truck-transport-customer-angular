import { Component } from '@angular/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
})
export class CustomersComponent {

  constructor(){}

  heading = 'Customers';
  type = {'isCustomer': true};

  ngOnInit(): void {
  }

}
