import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {first} from "rxjs/operators";
import {shareReplay, Subscription} from "rxjs";
import {ChangeDetectorRef} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DriversService} from "./../drivers.service";
import Swal from 'sweetalert2';
import {TitleCasePipe} from '@angular/common';
import {UserManagementService} from "../../user-management/user-management.service";
import { environment } from 'src/environments/environment';
import * as _ from "underscore";
import {CountryService} from "../../../global/services/country.service";
// import { NgxMaskModule, IConfig } from 'ngx-mask'
// import {IMaskModule} from 'angular-imask';

@Component({
  selector: 'app-driver-listing',
  templateUrl: './driver-listing.component.html',
  styleUrls: ['./driver-listing.component.scss']
})
export class DriverListingComponent implements OnInit {

  apiServerPath: String = environment.apiServerPath;
  createDriverFormGroup: FormGroup;
  heading = 'Drivers';
  drivers: any[];
  users: any[];
  private driverSubscription: Subscription;
  private usersSubscription: Subscription;
  title = 'ng-bootstrap-modal-demo';
  modalOptions:NgbModalOptions;
  page: any = 1;
  limit: any;
  totalPages: any;
  totalPagesArray: any;
  totalResults: any;
  countries: any[];
  countryIsoCode: any = '';
  states: any[];
  stateIsoCode: any = '';
  cities: any[];

  constructor(
    private driversService: DriversService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private titleCasePipe: TitleCasePipe,
    private userManagementService: UserManagementService,
    private countryService: CountryService,
  ){
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      size:'xl'
    }
  }

  ngOnInit(): void {
    this.subscribers()
    this.initForm();
  }

  ngOnDestroy(){
    this.driverSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }

  initForm(){
    this.createDriverFormGroup = this.fb.group(
      {
        ratePerMile: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        active: [false, Validators.compose([])],
        first_name: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        last_name: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        gender: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        address: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        zip: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        state: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        city: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        country: [
          '',
          Validators.compose([Validators.required]),
        ],
        phone: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        mobile: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        ssn: [
          '',
          Validators.compose([]),
        ],
        tax_id: [
          '',
          Validators.compose([]),
        ],
        external_id: [
          '',
          Validators.compose([]),
        ],
        dispatcher: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([Validators.required])],
      }
    );
  }

  subscribers(){
    this.countryService.countries$.subscribe((countries: any) => {
      this.countries = countries;
    })
    this.subscribeDriver()
    this.subscribeUsers()
  }

  submit(){
    if (this.createDriverFormGroup.valid){
      let active = this.createDriverFormGroup.controls.active.value;
      let driver = {
        ratePerMile: parseFloat(this.createDriverFormGroup.controls.ratePerMile.value).toFixed(2),
        active: ((active === null || active === undefined || active === '' || active === false) ? false : true),
        first_name: this.createDriverFormGroup.controls.first_name.value,
        last_name: this.createDriverFormGroup.controls.last_name.value,
        gender: this.createDriverFormGroup.controls.gender.value,
        address: this.createDriverFormGroup.controls.address.value,
        zip: this.createDriverFormGroup.controls.zip.value,
        state: this.createDriverFormGroup.controls.state.value,
        city: this.createDriverFormGroup.controls.city.value,
        country: this.createDriverFormGroup.controls.country.value,
        phone: this.createDriverFormGroup.controls.phone.value,
        mobile: this.createDriverFormGroup.controls.mobile.value,
        ssn: this.createDriverFormGroup.controls.ssn.value,
        tax_id: this.createDriverFormGroup.controls.tax_id.value,
        external_id: this.createDriverFormGroup.controls.external_id.value,
        dispatcher: this.createDriverFormGroup.controls.dispatcher.value,
        email: this.createDriverFormGroup.controls.email.value,
        password: this.createDriverFormGroup.controls.password.value,
      };
      this.driversService.storeDriver({...driver})
        .pipe(shareReplay(), first())
        .subscribe((driver: any) => {
          this.modalService.dismissAll();
          this.createDriverFormGroup.reset();
          this.driversService.getAllDrivers(this.page);
        });
    }
  }

  subscribeDriver(){
    this.driverSubscription = this.driversService.drivers$.subscribe((drivers: any) => {
      this.drivers =  drivers.results
      this.page = drivers.page;
      this.limit = drivers.limit;
      this.totalPages = drivers.totalPages;
      this.totalPagesArray = Array.from({length:this.totalPages},(v,k)=>k+1);
      this.totalResults = drivers.totalResults;
      this.ref.detectChanges();
    });
    this.driversService.getAllDrivers(this.page);
  }

  subscribeUsers(){
    this.usersSubscription = this.userManagementService.users$.subscribe((users: any) => {
      this.users =  users.results
      // console.log("users");
      // console.log(this.users);
      this.ref.detectChanges();
    });
    this.userManagementService.getAllUsers(1, 'active=true');
  }

  paginationClicked(pageNum: any){
    // console.log('clicked page num is : ' + pageNum);
    this.page = pageNum;
    this.driversService.getAllDrivers(pageNum);
  }

  open(content: any){
    this.modalService.open(content, this.modalOptions).result.then((result) => {
    }, (reason) => {
    });
  }

  filterSubmit(filters: any){
    let driverFilters:any = {};
    if(filters['active'])
      driverFilters['active'] = filters['active']
    if(filters['country'])
      driverFilters['country'] = filters['country']
    if(filters['state'])
      driverFilters['state'] = filters['state']
    if(filters['search'])
      driverFilters['search'] = filters['search']
    var queryString = Object.keys(driverFilters).map(key => key + '=' + driverFilters[key]).join('&');
    // console.log('Driver Query String');
    // queryString = queryString.replaceAll('location_', '');
    // console.log(queryString);
    this.driversService.getAllDrivers(1, queryString);
  }

  resetFilter(){
    this.driversService.getAllDrivers(1, '');
  }

  deleteDriver(driver: any){
    // console.log(driver)
    let fullDriverName = this.titleCasePipe.transform(driver.first_name + ' ' + driver.last_name);
    Swal.fire({
      title: 'Are you sure want to delete this driver ' + fullDriverName + ' ?',
      text: 'You will not be able to recover this driver',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete Driver',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#50CD89',
    }).then((result: any) => {
      if (result.value){
        this.driversService.deleteDriver(driver.id).pipe(shareReplay(), first())
          .subscribe((driver: any) => {
            this.driversService.getAllDrivers(this.page);
          });
        Swal.fire({
          title: 'Deleted!',
          html: 'Your driver ' + fullDriverName + ' has been deleted.',
          icon: 'success',
          confirmButtonColor: '#50CD89'
        })
      } else if (result.dismiss === Swal.DismissReason.cancel){
        Swal.fire({
          title: 'Cancelled',
          html: 'Your driver ' + fullDriverName + ' is safe :)',
          icon: 'error',
          confirmButtonColor: '#50CD89'
        })
      }
    })
  }

  export(){
    this.driversService.exportDrivers();
  }

  parseFloat(number: any){
    return parseFloat(number);
  }

  onCountryChange(selectedCountryId: any, callback: any = function(){}){
    let countryId = selectedCountryId.target.value;
    this.countryIsoCode = _.find(this.countries, (country) => {
      return country._id === countryId;
    }).isoCode;
    this.countryService.getStatesOfCountry(this.countryIsoCode)
      .pipe(shareReplay(), first())
      .subscribe({
        next: (states: any) => {
          // console.log('STATES POPULATED')
          this.states = states;
          if(callback)
            callback(this.states)
        },
        error: (error) => {
          console.log('PROFILE DETAIL ALL STATES ERROR');
          console.log(error);
        }
      })
  }

  onStateChange(selectedStateId: any, callback: any = function(){}){
    // console.log('onStateChange CALLED');
    let stateId = selectedStateId.target.value;
    this.stateIsoCode = _.find(this.states, (state) => {
      return state._id === stateId;
    }).isoCode;
    this.countryService.getCitiesOfState(this.countryIsoCode, this.stateIsoCode)
      .pipe(shareReplay(), first())
      .subscribe({
        next: (cities: any) => {
          this.cities = cities;
          if(callback)
            callback(this.cities)
        },
        error: (error) => {
          console.log('PROFILE DETAIL ALL CITIES ERROR');
          console.log(error);
        }
      })
  }

}
