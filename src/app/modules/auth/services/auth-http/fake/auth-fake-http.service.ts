import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';

import { UserModel } from '../../../models/user.model';
import { AuthModel } from '../../../models/auth.model';
import { UsersTable } from '../../../../../_fake/users.table';
import { environment } from '../../../../../../environments/environment';

// const API_USERS_URL = `api/users`;
const API_URL = `${environment.apiUrl}`;
const API_USERS_URL = `${environment.apiUrl}auth/login`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}
  getLoggedInUserFromAPI(email:any, password:any): Observable<any[]> {
    // return this.http.get<any[]>(API_USERS_URL);
    return this.http.post<any[]>(API_USERS_URL,  {
      "email": email,
      "password": password
    });/*.subscribe((result) => {
      console.log('submit login');
      console.log(result);
    });*/
  }
  // public methods
  login(email: string, password: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }
    return this.getLoggedInUserFromAPI(email, password)
      .pipe(
        map((user: any) => {
          // console.log('login response all user');
          // console.log(user);
          if (user === null || user === undefined || !user.hasOwnProperty('user')) {
            return notFoundError;
          }
          // const currentUser =
          // const user = result.find((u: any) => {
          //   return (
          //     u.email.toLowerCase() === email.toLowerCase() &&
          //     u.password === password
          //   );
          // });
          // if (!user) {
          //   return notFoundError;
          // }
          // console.log('login response final');
          // console.log(user);
          // return false;
          const auth = new AuthModel();
          auth.user = user.user;
          auth.authToken = user.tokens.access.token;
          auth.refreshToken = user.tokens.refresh.token;
          auth.expiresIn = user.tokens.access.expires; //new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
          // auth.authToken = user.authToken;
          // auth.refreshToken = user.refreshToken;
          // auth.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
          return auth;
        }),
        catchError((err) => {
          console.error('err login');
          console.error(err.error)
          return of(err.error);
          // return err.error;
        }),
      );
  }

  createUser(user: UserModel): Observable<any> {
    user.roles = [2]; // Manager
    user.authToken = 'auth-token-' + Math.random();
    user.refreshToken = 'auth-token-' + Math.random();
    user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
    user.pic = './assets/media/avatars/300-1.jpg';

    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any[]>(API_URL+'auth/forgot-password',  {
      "email": email
    });
    // return this.getAllUsers().pipe(
    //   map((result: UserModel[]) => {
    //     const user = result.find(
    //       (u) => u.email.toLowerCase() === email.toLowerCase()
    //     );
    //     return user !== undefined;
    //   })
    // );
  }

  resetPassword(resetPassData: any): Observable<any> {
    return this.http.post<any[]>(API_URL+'auth/reset-password?token='+resetPassData?.token,  {password: resetPassData?.password});
  }

  getUserByToken(token: string): Observable<UserModel | undefined> {
    const user = UsersTable.users.find((u: UserModel) => {
      return u.authToken === token;
    });

    if (!user) {
      return of(undefined);
    }

    return of(user);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(API_USERS_URL);
  }
}
