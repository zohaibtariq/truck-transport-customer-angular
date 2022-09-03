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
export class LoadsService {

  loads$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  load$: BehaviorSubject<{}> = new BehaviorSubject<{}>({});

  constructor(private http: HttpClient){ }

  getLoad(id:any): Subscription {
    return this.http.get<{}>(API_USERS_URL+'loads/'+id)
      .pipe(shareReplay(), first())
      .subscribe((load: any | undefined) => {
        this.load$.next(load);
      });
  }

  getAllLoads(status: string, page: any, optionsQueryString = ''): Subscription {
    let statusString = '';
    if(status !== '')
      statusString = 'status='+status;
    let url = API_USERS_URL+'loads?'+statusString+'&page='+page+((optionsQueryString !== '') ? '&'+optionsQueryString:'')+'&sortBy=createdAtDateTime:desc';
    return this.http.get<any[]>(url)
      .pipe(shareReplay(), first())
      .subscribe((loads: any | undefined) => {
        this.loads$.next(loads);
      });
  }

  storeLoad(load: any): Observable<any> {
    let url = API_USERS_URL+'loads/create';
    return this.http.post<any[]>(url, {...load});
  }

  updateLoad(loadId: any, load: any): Observable<any> {
    let url = API_USERS_URL+'loads/'+loadId;
    return this.http.post<any[]>(url, {...load});
  }

  deleteLoad(loadId: any): Observable<any> {
    let url = API_USERS_URL+'loads/'+loadId;
    return this.http.delete<any[]>(url, {});
  }

  exportProfiles(type: any): Subscription {
    const typeKey = Object.keys(type)[0];
    const typeValue = type[typeKey];
    let url = API_USERS_URL+'loads/export/profiles?'+typeKey+'='+typeValue;
    return this.http.post<any[]>(url, {}, { responseType: 'text' as any })
      .pipe(shareReplay(), first())
      .subscribe((blob:any) => {
        const blobData = new Blob([blob])
        let fileName = typeKey.substring(2).toLowerCase()+'-profiles-'+(new Date().toTimeString())+'.csv';
        saveAs(blobData, fileName);
      });
  }

  exportProfilesContactPerson(pageSlug: any, id: any): Subscription {
    let url = API_USERS_URL+'loads/export/profile/'+id;
    return this.http.post<any[]>(url, {}, { responseType: 'text' as any })
      .pipe(shareReplay(), first())
      .subscribe((blob:any) => {
        const blobData = new Blob([blob])
        let fileName = pageSlug.toLowerCase()+'-contact-persons-of-profile-'+(new Date().toTimeString())+'.csv';
        saveAs(blobData, fileName);
      });
  }

  importProfiles(data: any[]): Observable<any> {
    let url = API_USERS_URL+'loads/import/profiles';
    return this.http.post<any[]>(url, data);
  }

  beautifyAddress(Obj: any){
    let beautifiedAddress = '';
    if(Obj?.location?.address1){
      let address = Obj?.location?.address1.toLowerCase()
      beautifiedAddress += this.capitalize(address)
    }
    if(beautifiedAddress !== '' && Obj?.location?.state && Obj?.location?.state?.name){
      let state = Obj?.location?.state?.name.toLowerCase()
      beautifiedAddress += ', ' + state.toUpperCase()
    }
    if(beautifiedAddress !== '' && Obj?.location?.city && Obj?.location?.city?.name){
      let city = Obj?.location?.city?.name.toLowerCase()
      beautifiedAddress += ', ' + this.ucfirst(city)
    }
    if(beautifiedAddress !== '' && Obj?.location?.zip){
      let zip = Obj?.location?.zip.toLowerCase()
      beautifiedAddress += ', ' + zip
    }
    return beautifiedAddress;
  }

  capitalize(sentence = ''){
    const words = sentence.split(" ");
    return words.map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    }).join(" ");
  }

  ucfirst(word = ''){
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

}
