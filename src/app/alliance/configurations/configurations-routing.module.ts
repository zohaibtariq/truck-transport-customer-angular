import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ConfigurationsComponent} from "./configurations.component";
import {ChargesComponent} from "./charges/charges.component";
import {GoodsComponent} from "./goods/goods.component";

const routes: Routes = [
  {
    path: '',
    component: ConfigurationsComponent,
    children: [
      {
        path: 'charges',
        component: ChargesComponent,
      },
      {
        path: 'goods',
        component: GoodsComponent,
      },
      { path: '', redirectTo: 'charges', pathMatch: 'full' },
      { path: '**', redirectTo: 'charges', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationsRoutingModule {}
