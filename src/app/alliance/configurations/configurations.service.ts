import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, Subscription, shareReplay} from "rxjs";
import {first} from "rxjs/operators";
// import {saveAs} from "file-saver";

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  goods$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  good$: BehaviorSubject<{}> = new BehaviorSubject<{}>({});

  constructor(private http: HttpClient){ }

  getGood(id:any): Subscription {
    return this.http.get<{}>(API_USERS_URL+'goods-management/'+id)
      .pipe(shareReplay(), first())
      .subscribe((good: any | undefined) => {
        this.good$.next(good);
      });
  }

  getAllGoods(page: any, optionsQueryString = ''): Subscription {
    let api_url = API_USERS_URL+'goods-management?page='+page+((optionsQueryString !== '') ? '&'+optionsQueryString:'');
    return this.http.get<any[]>(api_url)
      .pipe(shareReplay(), first())
      .subscribe((goods: any | undefined) => {
        this.goods$.next(goods);
      });
  }

  storeGood(good: any): Observable<any> {
    let url = API_USERS_URL+'goods-management';
    return this.http.post<any[]>(url, {...good});
  }

  updateGood(goodId: any, good: any): Observable<any> {
    let url = API_USERS_URL+'goods-management/'+goodId;
    return this.http.post<any[]>(url, {...good});
  }

  deleteGood(goodId: any): Observable<any> {
    let url = API_USERS_URL+'goods-management/'+goodId;
    return this.http.delete<any[]>(url);
  }

}
