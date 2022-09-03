import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DriversComponent} from "./drivers/drivers.component";
import {DriverDetailComponent} from "./drivers/driver-detail/driver-detail.component";
import {DriverListingComponent} from "./drivers/driver-listing/driver-listing.component";
import {DriverImportComponent} from "./drivers/driver-import/driver-import.component";

const routes: Routes = [
  {
    path: '',
    component: DriversComponent,
    children: [
      {
        path: 'listing',
        component: DriverListingComponent,
      },
      {
        path: 'listing/import',
        component: DriverImportComponent,
      },
      {
        path: 'detail/:id',
        component: DriverDetailComponent,
      },
      { path: '', redirectTo: 'drivers', pathMatch: 'full' },
      { path: '**', redirectTo: 'drivers', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriversRoutingModule {}
