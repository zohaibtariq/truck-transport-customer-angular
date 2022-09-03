import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InlineSVGModule} from "ng-inline-svg-2";
import {ReactiveFormsModule} from "@angular/forms";
import {ChargesComponent} from "./charges/charges.component";
import {GoodsComponent} from "./goods/goods.component";
import {ConfigurationsRoutingModule} from "./configurations-routing.module";
import {ConfigurationsComponent} from "./configurations.component";

@NgModule({
  declarations: [
    ConfigurationsComponent,
    ChargesComponent,
    GoodsComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    ReactiveFormsModule,
    ConfigurationsRoutingModule
  ],
  exports: [
    ReactiveFormsModule
  ]
})
export class ConfigurationsModule {}
