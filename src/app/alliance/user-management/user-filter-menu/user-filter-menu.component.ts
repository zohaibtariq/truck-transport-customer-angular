import { Component, HostBinding, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Output, EventEmitter } from '@angular/core';
import {UserManagementService} from "../user-management.service";

@Component({
  selector: 'app-user-filter-menu',
  templateUrl: './user-filter-menu.component.html',
  styleUrls: ['./user-filter-menu.component.scss']
})
export class UserFilterMenuComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-400px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @Output() listenFilterSubmit = new EventEmitter<string>();
  @Output() listenResetFilter = new EventEmitter<string>();
  filterFormGroup: FormGroup;

  constructor(private userManagementService: UserManagementService, private fb: FormBuilder){}

  ngOnInit(): void {
    this.initForm()
  }

  initForm(){
    this.filterFormGroup = this.fb.group(
      {
        name: ['', Validators.compose([])],
        active: ['', Validators.compose([])],
        email: ['', Validators.compose([])],
        role: ['', Validators.compose([])],
        gender: ['', Validators.compose([])]
      }
    );
  }

  filterSubmit(){
    if (this.filterFormGroup.valid){
      let user:any = {};
      if(this.filterFormGroup.controls.name.value){
        user['name'] = this.filterFormGroup.controls.name.value
        user['email'] = this.filterFormGroup.controls.name.value
      }
      if(this.filterFormGroup.controls.active.value)
        user['active'] = this.filterFormGroup.controls.active.value
      if(this.filterFormGroup.controls.role.value)
        user['role'] = this.filterFormGroup.controls.role.value
      if(this.filterFormGroup.controls.gender.value)
        user['gender'] = this.filterFormGroup.controls.gender.value
      // @ts-ignore
      var queryString = Object.keys(user).map(key => key + '=' + user[key]).join('&');
      this.listenFilterSubmit.emit(queryString);
    }
  }

  resetFilter(){
    this.listenResetFilter.emit();
  }

}
