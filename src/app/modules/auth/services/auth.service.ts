import { Injectable, OnDestroy } from '@angular/core';
import {Observable, BehaviorSubject, of, Subscription, EMPTY} from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<any>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    // const subscr = this.getUserByToken().subscribe();
    const subscr = this.getUserByToken();
    // this.unsubscribe.push(subscr);
    // console.log("currentUser$");
    // console.log(this.currentUser$);
  }

  // public methods
  login(email: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: any) => {
        const result = this.setAuthFromLocalStorage(auth);
        // console.log('getAuthFromLocalStorage');
        // console.log(this.getAuthFromLocalStorage());
        // console.log('LOGIN SET AUTH');
        // console.log(result);
        return result;
      }),
      switchMap(async () => this.getCustomUserByToken()),
      // switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(err);
        // return err;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    // this.currentUserSubject.next(of(undefined));
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): object {
    // this.isLoadingSubject.next(true);
    // console.log('AuthService listened getUserByToken');
    const auth = this.getAuthFromLocalStorage();
    // console.log(auth);
    if (!auth || !auth.authToken || !auth.user) {
      return of(undefined);
    }
    const user = auth.user;
    if (user) {
      // console.log('if user');
      // console.log(user);
      this.currentUserSubject.next(user);
    } else {
      // console.log('else');
      this.logout();
    }
    return user;
    // this.isLoadingSubject.next(false)
    // console.log('authHttpService calling getUserByToken');
    // return this.authHttpService.getUserByToken(auth.authToken).pipe(
    //   map((user: UserType) => {
    //     console.log('authHttpService getUserByToken map');
    //     console.log(user);
    //     if (user) {
    //       console.log('if user');
    //       console.log(user);
    //       this.currentUserSubject.next(user);
    //     } else {
    //       console.log('else');
    //       this.logout();
    //     }
    //     return user;
    //   }),
    //   finalize(() => this.isLoadingSubject.next(false))
    // );
  }

  getCustomUserByToken(): object | undefined {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken || !auth.user) {
      return of(undefined);
    }
    this.isLoadingSubject.next(true);
    this.currentUserSubject.next(auth?.user);
    this.isLoadingSubject.next(false)
    return auth?.user;
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  updateIsLoadingSubject(flag: boolean){
    this.isLoadingSubject.next(flag);
  }

  resetPassword(resetPassData: object): Observable<any> {
    return this.authHttpService
      .resetPassword(resetPassData)
  }

  forgotPassword(email: string): Observable<any> {
    return this.authHttpService
      .forgotPassword(email)
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/expiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  getAuthFromLocalStorage(): AuthModel | undefined {
    // console.log('getAuthFromLocalStorage');
    try {
      // console.log('lsValue');
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      // console.log(lsValue);
      if (!lsValue) {
        return undefined;
      }
      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
