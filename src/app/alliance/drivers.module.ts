import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// import {WidgetsModule} from "../_metronic/partials";
import {DriversComponent} from "./drivers/drivers.component";
import {InlineSVGModule} from "ng-inline-svg-2";
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {DriversRoutingModule} from "./drivers-routing.module";
import {DropdownMenusModule} from "./theme/dropdown-menus/dropdown-menus.module";
import {DriverDetailComponent} from "./drivers/driver-detail/driver-detail.component";
import {DriverListingComponent} from "./drivers/driver-listing/driver-listing.component";
import {DriverImportComponent} from "./drivers/driver-import/driver-import.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {IMaskModule} from 'angular-imask';
// import { SelectDropDownModule } from 'ngx-select-dropdown'
import { NgSelectModule } from '@ng-select/ng-select';

// import { NgxMaskModule, IConfig } from 'ngx-mask'
// const maskConfigFunction: () => Partial<IConfig> = () => {
//   return {
//     validation: false,
//   };
// };
@NgModule({
  declarations: [
    DriversComponent,
    DriverListingComponent,
    DriverDetailComponent,
    DriverImportComponent
  ],
  imports: [
    CommonModule,
    DriversRoutingModule,
    // WidgetsModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    DropdownMenusModule,
    NgbModule,
    IMaskModule,
    // SelectDropDownModule,
    NgSelectModule
    // NgxMaskModule.forRoot(maskConfigFunction),
  ],
})
export class DriversModule {}
