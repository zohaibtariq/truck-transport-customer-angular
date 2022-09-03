import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterMenuComponent} from "./filter-menu/filter-menu.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ExportMenuComponent } from './export-menu/export-menu.component';
// import {MatDatepickerModule} from "@angular/material/datepicker";
// import {MatFormFieldModule} from "@angular/material/form-field";
// import {MatMomentDateModule} from "@angular/material/datepicker";
// import {MatNativeDateModule} from "@angular/material/";

// import { MatDatepickerModule,
//   MatNativeDateModule,
//   MatFormFieldModule,
//   MatInputModule } from '@angular/material';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {LoadListingFilterMenuComponent} from "./load-listing-filter-menu/load-listing-filter-menu.component";
// import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    FilterMenuComponent,
    ExportMenuComponent,
    LoadListingFilterMenuComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    FilterMenuComponent,
    ExportMenuComponent,
    LoadListingFilterMenuComponent,
  ],
})
export class DropdownMenusModule {}
