import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoadsComponent} from "./loads.component";
import {PendingComponent} from "./pending/pending.component";
import {ActiveComponent} from "./active/active.component";
import {AssignedComponent} from "./assigned/assigned.component";
import {EnrouteComponent} from "./enroute/enroute.component";
import {CompletedComponent} from "./completed/completed.component";
import {CancelledComponent} from "./cancelled/cancelled.component";
import {AllComponent} from "./all/all.component";
import {DetailComponent} from "./detail/detail.component";
import {TenderedComponent} from "./tendered/tendered.component";

const routes: Routes = [
  {
    path: '',
    component: LoadsComponent,
    children: [
      {
        path: 'pending',
        component: PendingComponent,
      },
      {
        path: 'assigned',
        component: AssignedComponent,
      },
      {
        path: 'tendered',
        component: TenderedComponent,
      },
      {
        path: 'active',
        component: ActiveComponent,
      },
      {
        path: 'enroute',
        component: EnrouteComponent,
      },
      {
        path: 'completed',
        component: CompletedComponent,
      },
      {
        path: 'cancelled',
        component: CancelledComponent,
      },
      {
        path: 'all',
        component: AllComponent,
      },
      {
        path: ':pageSlug/:id',
        component: DetailComponent,
      },
      { path: '', redirectTo: '/loads/all', pathMatch: 'full' },
      { path: '**', redirectTo: '/loads/all', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadsRoutingModule {}
