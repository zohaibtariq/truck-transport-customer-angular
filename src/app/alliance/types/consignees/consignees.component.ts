import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consignees',
  templateUrl: './consignees.component.html',
})
export class ConsigneesComponent implements OnInit {

  constructor(){ }

  heading = 'Consignees';
  pageSlug = 'consignees';
  type = {'isConsignee': true};

  ngOnInit(): void {
  }

}
