import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserManagementComponent} from "./user-management.component";
import {UserListingComponent} from "./user-listing/user-listing.component";
import {UserDetailComponent} from "./user-detail/user-detail.component";
import {UserImportComponent} from "./user-import/user-import.component";

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      {
        path: 'listing',
        component: UserListingComponent,
      },
      {
        path: 'listing/import',
        component: UserImportComponent,
      },
      {
        path: 'detail/:id',
        component: UserDetailComponent,
      },
      { path: '', redirectTo: 'listing', pathMatch: 'full' },
      { path: '**', redirectTo: 'listing', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
