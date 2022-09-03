import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../../../../environments/environment";
import {BehaviorSubject, Subscription, shareReplay} from "rxjs";
import {first} from "rxjs/operators";
import {saveAs} from 'file-saver';

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  profileRoutePath: String = 'products';
  maxLimit = 1000;
  profiles$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  profile$: BehaviorSubject<{}> = new BehaviorSubject<{}>({});
  customers$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  shippers$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient){ }

  getProfile(id:any): Subscription {
    return this.http.get<{}>(API_USERS_URL+this.profileRoutePath+'/'+id)
      .pipe(shareReplay(), first())
      .subscribe((product: any | undefined) => {
        this.profile$.next(product);
      });
  }

  getAllProfiles(type: any, page: any, optionsQueryString = ''): Subscription {
    const typeKey = Object.keys(type)[0];
    const typeValue = type[typeKey];
    return this.http.get<any[]>(API_USERS_URL+this.profileRoutePath+'?'+typeKey+'='+typeValue+'&page='+page+((optionsQueryString !== '') ? '&'+optionsQueryString:''))
      .pipe(shareReplay(), first())
      .subscribe((profiles: any | undefined) => {
        this.profiles$.next(profiles);
      });
  }

  getCustomerProfiles(): Subscription {
    return this.http.get<any[]>(API_USERS_URL+this.profileRoutePath+'?isCustomer=true&limit='+this.maxLimit)
      .pipe(shareReplay(), first())
      .subscribe((customers: any | undefined) => {
        this.customers$.next(customers);
      });
  }

  getShipperProfiles(): Subscription {
    return this.http.get<any[]>(API_USERS_URL+this.profileRoutePath+'?isShipper=true&limit='+this.maxLimit)
      .pipe(shareReplay(), first())
      .subscribe((shippers: any | undefined) => {
        this.shippers$.next(shippers);
      });
  }

  storeProfile(product: any): Observable<any> {
    let url = API_USERS_URL+this.profileRoutePath+'/create';
    return this.http.post<any[]>(url, {...product});
  }

  updateProfile(productId: any, product: any): Observable<any> {
    let url = API_USERS_URL+this.profileRoutePath+'/'+productId;
    return this.http.post<any[]>(url, {...product});
  }

  deleteProfile(productId: any): Observable<any> {
    let url = API_USERS_URL+this.profileRoutePath+'/'+productId;
    return this.http.delete<any[]>(url, {});
  }

  exportProfiles(type: any): Subscription {
    const typeKey = Object.keys(type)[0];
    const typeValue = type[typeKey];
    let url = API_USERS_URL+this.profileRoutePath+'/export/profiles?'+typeKey+'='+typeValue;
    return this.http.post<any[]>(url, {}, { responseType: 'text' as any })
      .pipe(shareReplay(), first())
      .subscribe((blob:any) => {
        const blobData = new Blob([blob])
        let fileName = typeKey.substring(2).toLowerCase()+'-profiles-'+(new Date().toTimeString())+'.csv';
        saveAs(blobData, fileName);
      });
  }

  exportProfilesContactPerson(pageSlug: any, id: any): Subscription {
    let url = API_USERS_URL+this.profileRoutePath+'/export/profile/'+id;
    return this.http.post<any[]>(url, {}, { responseType: 'text' as any })
      .pipe(shareReplay(), first())
      .subscribe((blob:any) => {
        const blobData = new Blob([blob])
        let fileName = pageSlug.toLowerCase()+'-contact-persons-of-profile-'+(new Date().toTimeString())+'.csv';
        saveAs(blobData, fileName);
      });
  }

  importProfiles(data: any[]): Observable<any> {
    let url = API_USERS_URL+this.profileRoutePath+'/import/profiles';
    return this.http.post<any[]>(url, data);
  }

}
