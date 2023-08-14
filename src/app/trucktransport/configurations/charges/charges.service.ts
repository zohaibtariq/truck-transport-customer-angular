import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {BehaviorSubject, Subscription, shareReplay} from "rxjs";
import {first} from "rxjs/operators";

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class ChargesService {

  allActiveCharges$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  charges$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  charge$: BehaviorSubject<{}> = new BehaviorSubject<{}>({});

  constructor(private http: HttpClient){ }

  getCharge(id:any): Subscription {
    return this.http.get<{}>(API_USERS_URL+'charges/'+id)
      .pipe(shareReplay(), first())
      .subscribe((charge: any | undefined) => {
        this.charge$.next(charge);
      });
  }

  getAllCharges(page: any, optionsQueryString = ''): Subscription {
    let api_url = API_USERS_URL+'charges?page='+page+((optionsQueryString !== '') ? '&'+optionsQueryString:'');
    return this.http.get<any[]>(api_url)
      .pipe(shareReplay(), first())
      .subscribe((charges: any | undefined) => {
        this.charges$.next(charges);
      });
  }

  getAllActiveCharges(optionsQueryString = ''): Subscription {
    let api_url = API_USERS_URL+'charges?'+((optionsQueryString !== '') ? '&'+optionsQueryString:'');
    return this.http.get<any[]>(api_url)
      .pipe(shareReplay(), first())
      .subscribe((charges: any | undefined) => {
        this.allActiveCharges$.next(charges);
      });
  }

  storeCharge(charge: any): Observable<any> {
    let url = API_USERS_URL+'charges';
    return this.http.post<any[]>(url, {...charge});
  }

  updateCharge(chargeId: any, charge: any): Observable<any> {
    let url = API_USERS_URL+'charges/'+chargeId;
    return this.http.post<any[]>(url, {...charge});
  }

  deleteCharge(chargeId: any): Observable<any> {
    let url = API_USERS_URL+'charges/'+chargeId;
    return this.http.delete<any[]>(url);
  }

}
