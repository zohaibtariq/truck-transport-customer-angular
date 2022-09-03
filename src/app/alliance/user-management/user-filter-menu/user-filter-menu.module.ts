import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserFilterMenuComponent} from "./user-filter-menu.component";

@NgModule({
  declarations: [
    UserFilterMenuComponent
  ],
  imports: [
    CommonModule,
    // FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    UserFilterMenuComponent
  ],
})
export class UserFilterMenusModule {}
