import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';

import { UserModel } from '../../../models/user.model';
import { AuthModel } from '../../../models/auth.model';
import { UsersTable } from '../../../../../_fake/users.table';
import { environment } from '../../../../../../environments/environment';

const API_URL = `${environment.apiUrl}`;
const API_PROFILES_URL = `${environment.apiUrl}profiles/login`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}
  getLoggedInUserFromAPI(email:any, password:any): Observable<any[]> {
    // return this.http.get<any[]>(API_PROFILES_URL);
    return this.http.post<any[]>(API_PROFILES_URL,  {
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
        map((profile: any) => {
          // console.log('login response all profile');
          // console.log(profile);
          if (profile === null || profile === undefined || !profile.hasOwnProperty('profile')) {
            return notFoundError;
          }
          // const currentUser =
          // const profile = result.find((u: any) => {
          //   return (
          //     u.email.toLowerCase() === email.toLowerCase() &&
          //     u.password === password
          //   );
          // });
          // if (!profile) {
          //   return notFoundError;
          // }
          // console.log('login response final');
          // console.log(profile);
          // return false;
          const auth = new AuthModel();
          auth.profile = profile.profile;
          auth.authToken = profile.tokens.access.token;
          auth.refreshToken = profile.tokens.refresh.token;
          auth.expiresIn = profile.tokens.access.expires; //new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
          // auth.authToken = profile.authToken;
          // auth.refreshToken = profile.refreshToken;
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

  createUser(profile: UserModel): Observable<any> {
    console.log('MUST NOT GET CALLED ::: createUser');
    profile.roles = [2]; // Manager
    profile.authToken = 'auth-token-' + Math.random();
    profile.refreshToken = 'auth-token-' + Math.random();
    profile.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
    profile.pic = './assets/media/avatars/300-1.jpg';

    return this.http.post<UserModel>(API_PROFILES_URL, profile);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any[]>(API_URL+'profiles/forgot-password',  {
      "email": email
    });
    // return this.getAllUsers().pipe(
    //   map((result: UserModel[]) => {
    //     const profile = result.find(
    //       (u) => u.email.toLowerCase() === email.toLowerCase()
    //     );
    //     return profile !== undefined;
    //   })
    // );
  }

  resetPassword(resetPassData: any): Observable<any> {
    return this.http.post<any[]>(API_URL+'profiles/reset-password?token='+resetPassData?.token,  {password: resetPassData?.password});
  }

  getUserByToken(token: string): Observable<UserModel | undefined> {
    console.log('MUST NOT GET CALLED ::: getUserByToken 1');
    const profile = UsersTable.users.find((u: UserModel) => {
      return u.authToken === token;
    });

    if (!profile) {
      return of(undefined);
    }

    return of(profile);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(API_PROFILES_URL);
  }
}
