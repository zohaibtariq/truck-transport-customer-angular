import { Component, HostBinding, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-load-listing-filter-menu',
  templateUrl: './load-listing-filter-menu.component.html',
})
export class LoadListingFilterMenuComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-400px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @Output() listenFilterSubmit = new EventEmitter<string>();
  @Output() listenResetFilter = new EventEmitter<string>();
  filterFormGroup: FormGroup;

  constructor(private fb: FormBuilder){}

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
      }
    );
  }

  filterSubmit(){
    if (this.filterFormGroup.valid){
      let filters:any = {};
      if(this.filterFormGroup.controls.active.value)
        filters['active'] = this.filterFormGroup.controls.active.value
      if(this.filterFormGroup.controls.locationCountry.value)
        filters['country'] = this.filterFormGroup.controls.locationCountry.value
      if(this.filterFormGroup.controls.search.value)
        filters['search'] = this.filterFormGroup.controls.search.value
      if(this.filterFormGroup.controls.locationState.value)
        filters['state'] = this.filterFormGroup.controls.locationState.value
      this.listenFilterSubmit.emit(filters);
    }
  }

  resetFilter(){
    this.listenResetFilter.emit();
  }

}
