import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TypesComponent} from "./types/types.component";
import {TypesRoutingModule} from "./types-routing.module";
// import {WidgetsModule} from "../_metronic/partials";
// import {DriversComponent} from "./types/drivers/drivers.component";
import {CommonDataTypesComponent} from "./types/common-data-types/common-data-types.component";
import {CustomersComponent} from "./types/customers/customers.component";
import {ShippersComponent} from './types/shippers/shippers.component';
import {ConsigneesComponent} from './types/consignees/consignees.component';
import {BillTosComponent} from './types/bill-tos/bill-tos.component';
import {BrokersComponent} from './types/brokers/brokers.component';
import {ForwardersComponent} from './types/forwarders/forwarders.component';
import {InlineSVGModule} from "ng-inline-svg-2";
import {TerminalsComponent} from './types/terminals/terminals.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {DetailComponent} from './types/detail/detail.component';
import {MatTabsModule} from '@angular/material/tabs';
import {DropdownMenusModule} from "./theme/dropdown-menus/dropdown-menus.module";
import {TypeImportComponent} from "./types/common-data-types/type-import/type-import.component";
import {IMaskModule} from 'angular-imask';
@NgModule({
  declarations: [
    TypesComponent,
    CommonDataTypesComponent,
    CustomersComponent,
    ShippersComponent,
    ConsigneesComponent,
    BillTosComponent,
    BrokersComponent,
    ForwardersComponent,
    TerminalsComponent,
    DetailComponent,
    TypeImportComponent
  ],
  imports: [
    CommonModule,
    TypesRoutingModule,
    // WidgetsModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    DropdownMenusModule,
    IMaskModule,
  ],
})
export class TypesModule {}
