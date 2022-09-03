import { Component, HostBinding, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmPasswordValidator} from "../../../../modules/auth";
import {shareReplay} from "rxjs";
import {first} from "rxjs/operators";
import {TypesService} from "../../../types/services/types.service";
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
})
export class FilterMenuComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-400px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @Output() listenFilterSubmit = new EventEmitter<string>();
  @Output() listenResetFilter = new EventEmitter<string>();
  filterFormGroup: FormGroup;

  constructor(private typesService: TypesService, private fb: FormBuilder){}

  ngOnInit(): void {
    this.initForm()
  }

  initForm(){
    this.filterFormGroup = this.fb.group(
      {
        search: [
          '',
          Validators.compose([]),
        ],
        active: ['', Validators.compose([])],
        locationState: [
          '',
          Validators.compose([]),
        ],
        locationCountry: [
          '',
          Validators.compose([]),
        ],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  filterSubmit(){
    if (this.filterFormGroup.valid){
      let filters:any = {};
      // let product:any = {};
      if(this.filterFormGroup.controls.active.value)
        filters['active'] = this.filterFormGroup.controls.active.value
        // product['active'] = this.filterFormGroup.controls.active.value
      if(this.filterFormGroup.controls.locationCountry.value)
        filters['country'] = this.filterFormGroup.controls.locationCountry.value
        // product['location_country'] = this.filterFormGroup.controls.locationCountry.value
      if(this.filterFormGroup.controls.search.value)
        filters['search'] = this.filterFormGroup.controls.search.value
      // if(this.filterFormGroup.controls.search.value){
        // product['location_id'] = this.filterFormGroup.controls.search.value
        // product['location_name'] = this.filterFormGroup.controls.search.value
        // product['location_address1'] = this.filterFormGroup.controls.search.value
        // product['location_phone'] = this.filterFormGroup.controls.search.value
        // product['location_fax'] = this.filterFormGroup.controls.search.value
        // product['location_zip'] = this.filterFormGroup.controls.search.value
      // }
      if(this.filterFormGroup.controls.locationState.value)
        filters['state'] = this.filterFormGroup.controls.locationState.value
        // product['location_state'] = this.filterFormGroup.controls.locationState.value
      // @ts-ignore
      // var queryString = Object.keys(filters).map(key => key + '=' + filters[key]).join('&');
      // this.productSubscription = this.typesService.profiles$.subscribe((products: any) => {
      // });
      this.listenFilterSubmit.emit(filters);
      // this.listenFilterSubmit.emit(queryString);
      // this.typesService.getAllProfiles({'isBillTo': true}, 1, queryString);
      // this.typesService.storeProfile({...product})
      //   .pipe(shareReplay(), first())
      //   .subscribe((product: any) => {
      //     console.log('create product');
      //     console.log(product);
      //     this.filterFormGroup.reset();
      //   });
    }
  }

  resetFilter(){
    this.listenResetFilter.emit();
  }

  // filterProducts(){
    // this.productSubscription = this.typesService.profiles$.subscribe((products: any) => {
    // });
    // this.typesService.getAllProfiles(this.type, 1);
  // }
}
