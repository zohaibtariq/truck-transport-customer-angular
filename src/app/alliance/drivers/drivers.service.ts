import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";
import {Subject, BehaviorSubject, Subscription, shareReplay} from "rxjs";
import {first} from "rxjs/operators";
import {saveAs} from "file-saver";

const API_USERS_URL = `${environment.apiUrl}`;
const MAX_LIMIT = `${environment.maxLimit}`;

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  maxLimit = MAX_LIMIT;
  drivers$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  activeDriversToInvite$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  driver$: BehaviorSubject<{}> = new BehaviorSubject<{}>({});

  constructor(private http: HttpClient){ }

  getDriver(id:any): Subscription {
    return this.http.get<{}>(API_USERS_URL+'drivers/'+id)
      .pipe(shareReplay(), first())
      .subscribe((driver: any | undefined) => {
        this.driver$.next(driver);
      });
  }

  getAllDrivers(page: any, optionsQueryString = ''): Subscription {
    return this.http.get<any[]>(API_USERS_URL+'drivers?page='+page+((optionsQueryString !== '') ? '&'+optionsQueryString:''))
      .pipe(shareReplay(), first())
      .subscribe((drivers: any | undefined) => {
        this.drivers$.next(drivers);
      });
  }

  getActiveDriversToInvite(): Subscription {
    // TODO:: NO NEED TO DO IT INVESTIGATE IT FURTHER IF SUCH REQ REALLY NEEDED, pass driver id to ignore as a param take this id in query string to api and get data from api without that id.
    //  (I have researched over it and decided its not required bcz if i skip then they will not be able to send invite to same driver again
    //  if driver doesn't receives it then he might ask them to invite him again.)
    return this.http.get<any[]>(API_USERS_URL+'drivers?limit='+this.maxLimit)
      .pipe(shareReplay(), first())
      .subscribe((drivers: any | undefined) => {
        this.activeDriversToInvite$.next(drivers);
      });
  }

  storeDriver(driver: any): Observable<any> {
    let url = API_USERS_URL+'drivers/create';
    return this.http.post<any[]>(url, {...driver});
  }

  updateDriver(driverId: any, driver: any): Observable<any> {
    // console.log('OBJ TO UODATE DRIVER');
    // console.log(driver);
    let url = API_USERS_URL+'drivers/'+driverId;
    return this.http.post<any[]>(url, {...driver});
  }

  uploadDriverImage(driverId: any, driverImage: any): Observable<any> {
    let url = API_USERS_URL+'drivers/'+driverId+'/upload';
    return this.http.post<any[]>(url, driverImage);
  }

  deleteDriver(driverId: any): Observable<any> {
    // let url = API_USERS_URL+'drivers/'+driverId+'/delete';
    let url = API_USERS_URL+'drivers/'+driverId;
    // console.log(url);
    return this.http.delete<any[]>(url);
  }

  exportDrivers(): Subscription {
    let url = API_USERS_URL+'drivers/export/drivers';
    return this.http.post<any[]>(url, {}, { responseType: 'text' as any })
      .pipe(shareReplay(), first())
      .subscribe((blob:any) => {
        const blobData = new Blob([blob])
        let fileName = 'drivers-'+(new Date().toTimeString())+'.csv';
        saveAs(blobData, fileName);
      });
  }

  importDrivers(data: any[]): Observable<any> {
    let url = API_USERS_URL+'drivers/import/drivers';
    return this.http.post<any[]>(url, data);
  }

}
