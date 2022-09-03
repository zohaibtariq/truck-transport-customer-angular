import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";
import {Subject, BehaviorSubject, Subscription, shareReplay} from "rxjs";
import {first} from "rxjs/operators";
import {saveAs} from "file-saver";

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  users$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  user$: BehaviorSubject<{}> = new BehaviorSubject<{}>({});

  constructor(private http: HttpClient){ }

  getUser(id:any): Subscription {
    return this.http.get<{}>(API_USERS_URL+'users-management/'+id)
      .pipe(shareReplay(), first())
      .subscribe((user: any | undefined) => {
        this.user$.next(user);
      });
  }

  getAllUsers(page: any, optionsQueryString = ''): Subscription {
    let api_url = API_USERS_URL+'users-management?page='+page+((optionsQueryString !== '') ? '&'+optionsQueryString:'');
    return this.http.get<any[]>(api_url)
      .pipe(shareReplay(), first())
      .subscribe((users: any | undefined) => {
        this.users$.next(users);
      });
  }

  storeUser(user: any): Observable<any> {
    let url = API_USERS_URL+'users-management';
    return this.http.post<any[]>(url, {...user});
  }

  updateUser(userId: any, user: any): Observable<any> {
    let url = API_USERS_URL+'users-management/'+userId;
    return this.http.post<any[]>(url, {...user});
  }

  uploadUserImage(userId: any, userImage: any): Observable<any> {
    let url = API_USERS_URL+'users-management/'+userId+'/upload';
    return this.http.post<any[]>(url, userImage);
  }

  deleteUser(userId: any): Observable<any> {
    let url = API_USERS_URL+'users-management/'+userId;
    return this.http.delete<any[]>(url);
  }

  exportUsers(): Subscription {
    let url = API_USERS_URL+'users-management/export/users';
    return this.http.post<any[]>(url, {}, { responseType: 'text' as any })
      .pipe(shareReplay(), first())
      .subscribe((blob:any) => {
        const blobData = new Blob([blob])
        let fileName = 'users-'+(new Date().toTimeString())+'.csv';
        saveAs(blobData, fileName);
      });
  }

  uniqueUsers(uniqueUserEmails: any): Observable<any> {
    let url = API_USERS_URL+'users-management/unique/email';
    return this.http.post<any[]>(url, uniqueUserEmails);
  }

  importUsers(data: any[]): Observable<any> {
    let url = API_USERS_URL+'users-management/import/users';
    return this.http.post<any[]>(url, data);
  }

}
