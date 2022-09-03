import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth';
import { environment } from 'src/environments/environment';
// import { SelectDropDownModule } from 'ngx-select-dropdown'

// #fake-start#
import { FakeAPIService } from './_fake';
import {TypesService} from "./alliance/types/services/types.service";
import {DropdownMenusModule} from "./alliance/theme/dropdown-menus/dropdown-menus.module";
import {TitleCasePipe} from "@angular/common";
// #fake-end#
// import {TypesService} from "./alliance/types/services/types.service";
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import {HeaderInterceptor} from "./interceptors/header.interceptor";
// import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

function appInitializer(authService: AuthService) {
  // console.log('appInitializer called');
  return () => {
    return new Promise((resolve) => {
      // console.log('calling getUserByToken');
      //@ts-ignore
      // authService.getUserByToken().subscribe().add(resolve);
      authService.getUserByToken();
      resolve(1)
    });
  };
}

// @ts-ignore
// @ts-ignore
// @ts-ignore
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
          passThruUnknownUrl: true,
          dataEncapsulation: false,
        })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    DropdownMenusModule,
    // NgxDaterangepickerMd.forRoot(),
    // SelectDropDownModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    TitleCasePipe,
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
