import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonComponent} from './common/common.component';
import {LoadsRoutingModule} from "./loads-routing.module";
import {LoadsComponent} from "./loads.component";
import {PendingComponent} from './pending/pending.component';
import {AssignedComponent} from './assigned/assigned.component';
import {ActiveComponent} from './active/active.component';
import {EnrouteComponent} from './enroute/enroute.component';
import {CompletedComponent} from './completed/completed.component';
import {CancelledComponent} from './cancelled/cancelled.component';
import {AllComponent} from './all/all.component';
import {InlineSVGModule} from "ng-inline-svg-2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownMenusModule} from "../theme/dropdown-menus/dropdown-menus.module";
import {DetailComponent} from './detail/detail.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MatTabsModule} from '@angular/material/tabs';
import {TenderedComponent} from "./tendered/tendered.component";
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
  declarations: [
    CommonComponent,
    LoadsComponent,
    PendingComponent,
    AssignedComponent,
    TenderedComponent,
    ActiveComponent,
    EnrouteComponent,
    CompletedComponent,
    CancelledComponent,
    AllComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    LoadsRoutingModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownMenusModule,
    NgbModule,
    MatTabsModule,
    NgSelectModule
  ],
})
export class LoadsModule {}
