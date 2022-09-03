import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserManagementComponent} from "./user-management.component";
import {UserListingComponent} from "./user-listing/user-listing.component";
import {UserManagementRoutingModule} from "./user-management-routing.module";
import {InlineSVGModule} from "ng-inline-svg-2";
import {ReactiveFormsModule} from "@angular/forms";
import {UserDetailComponent} from "./user-detail/user-detail.component";
import {UserFilterMenusModule} from "./user-filter-menu/user-filter-menu.module";
import {UserImportComponent} from "./user-import/user-import.component";

@NgModule({
  declarations: [
    UserManagementComponent,
    UserListingComponent,
    UserDetailComponent,
    UserImportComponent,
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    InlineSVGModule,
    ReactiveFormsModule,
    UserFilterMenusModule
  ],
})
export class UserManagementModule {}
