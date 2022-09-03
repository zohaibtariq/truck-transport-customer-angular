import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TypesComponent} from "./types/types.component";
// import {DriversComponent} from "./types/drivers/drivers.component";
import {DriversComponent} from "./drivers/drivers.component";
import {CustomersComponent} from "./types/customers/customers.component";
import {BillTosComponent} from "./types/bill-tos/bill-tos.component";
import {BrokersComponent} from "./types/brokers/brokers.component";
import {ConsigneesComponent} from "./types/consignees/consignees.component";
import {ForwardersComponent} from "./types/forwarders/forwarders.component";
import {ShippersComponent} from "./types/shippers/shippers.component";
import {TerminalsComponent} from "./types/terminals/terminals.component";
import {DetailComponent} from "./types/detail/detail.component";
import {TypeImportComponent} from "./types/common-data-types/type-import/type-import.component";

const routes: Routes = [
  {
    path: '',
    component: TypesComponent,
    children: [
      {
        path: 'bill-tos',
        component: BillTosComponent,
      },
      {
        path: 'brokers',
        component: BrokersComponent,
      },
      {
        path: 'consignees',
        component: ConsigneesComponent,
      },
      {
        path: 'customers',
        component: CustomersComponent,
      },
      {
        path: 'drivers',
        component: DriversComponent,
      },
      {
        path: 'forwarders',
        component: ForwardersComponent,
      },
      {
        path: 'shippers',
        component: ShippersComponent,
      },
      {
        path: 'terminals',
        component: TerminalsComponent,
      },
      {
        path: 'detail/:id/:pageSlug',
        component: DetailComponent,
      },
      {
        path: ':type/import',
        component: TypeImportComponent,
      },
      { path: '', redirectTo: 'customers', pathMatch: 'full' },
      { path: '**', redirectTo: 'customers', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypesRoutingModule {}
