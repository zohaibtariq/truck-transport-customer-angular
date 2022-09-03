import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {map, filter, catchError} from 'rxjs/operators';
import {AuthHTTPService} from "../modules/auth/services/auth-http";
import {Router} from "@angular/router";
import {AuthService} from "../modules/auth";
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('HEADER INTERCEPTOR');
    const auth = this.authService.getAuthFromLocalStorage();
    let token = '';
    let headers = {};
    if(auth !== undefined && auth.authToken !== '') {
      token = auth.authToken;
      headers = {
        'Authorization': 'Bearer ' + token
      };
    }
    // console.log(headers);
    const authReq = httpRequest.clone({ setHeaders: headers});
    // console.log('ALL HEADERS');
    // console.log(authReq);
    return next.handle(authReq).pipe(
      map(res => {
        // console.log("Passed through the interceptor in response");
        // console.log(res);
        return res
      }),
      // catchError((error: HttpErrorResponse) => {
      catchError((error: any) => {
        console.error('GLOBAL RESPONSE INTERCEPTOR');
        console.error(error);
        console.error(error.error);
        if(error.error.code === 401) {
          // console.log(error.error.message + ' (LOG HIM OUT OR USE REFRESH TOKEN)');
          this.authService.logout();
          console.log('location reload')
          console.log(this.router.url)
          let currentRouteURL = this.router.url.split('?')[0]; // without query param
          if(currentRouteURL !== '/auth/login')
            document.location.reload();
        }else if(error.error.code === 400) {
          if(error.error.message !== '')
            this.toastr.error(error.error.message, 'ERROR');
        }else if(!error.error.hasOwnProperty('code') && error.error.message !== ''){
          this.toastr.error(error.error.message, 'API ERROR');
        }
        return throwError(error)
      })
    );
  }
}
