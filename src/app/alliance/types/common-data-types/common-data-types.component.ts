import { Component, Input } from '@angular/core';
import {TypesService} from "../services/types.service";
import {first} from "rxjs/operators";
import {ConfirmPasswordValidator} from "../../../modules/auth";
import {shareReplay, Subscription} from "rxjs";
import {ChangeDetectorRef} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {TitleCasePipe} from '@angular/common';
import {UserManagementService} from "../../user-management/user-management.service";
import {CountryService} from "../../../global/services/country.service";
import * as _ from "underscore";

@Component({
  selector: 'app-common-data-types',
  templateUrl: './common-data-types.component.html',
})
export class CommonDataTypesComponent {

  createFormGroup: FormGroup;
  @Input() heading = '';
  @Input() type: any;
  products: any[];
  users: any[];
  typeKey: string;
  private productSubscription: Subscription;
  private usersSubscription: Subscription;
  title = 'ng-bootstrap-modal-demo';
  modalOptions:NgbModalOptions;
  page: any = 1;
  limit: any;
  totalPages: any;
  totalPagesArray: any;
  totalResults: any;
  pageSlug: any;
  countries: any[];
  countryIsoCode: any = '';
  states: any[];
  stateIsoCode: any = '';
  cities: any[];

  constructor(
    private typesService: TypesService,
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
    this.typeKey = Object.keys(this.type)[0];
    this.subscribers()
    this.initForm();
    this.pageSlug = this.heading.toLowerCase().replace(' ', '-')
    this.reInitForm();
  }

  reInitForm(){
    if(this.createFormGroup){
      this.createFormGroup.patchValue({
        active: false,
        isBillTo: this.typeKey==='isBillTo',
        isBroker: this.typeKey==='isBroker',
        isConsignee: this.typeKey==='isConsignee',
        isCustomer: this.typeKey==='isCustomer',
        isForwarder: this.typeKey==='isForwarder',
        isShipper: this.typeKey==='isShipper',
        isTerminal: this.typeKey==='isTerminal',
      });
    }
  }

  ngOnDestroy(){
    this.productSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }

  initForm(){
    this.createFormGroup = this.fb.group(
      {
        locationId: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        active: [false, Validators.compose([Validators.required])],
        locationName: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        locationAddress1: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        locationZip: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        locationState: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        locationCity: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        locationCountry: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        locationPhone: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        locationFax: [
          '',
          Validators.compose([]),
        ],
        locationExternalId: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        isCustomer: [false, Validators.compose([])],
        isBillTo: [false, Validators.compose([])],
        isConsignee: [false, Validators.compose([])],
        isShipper: [false, Validators.compose([])],
        isBroker: [false, Validators.compose([])],
        isForwarder: [false, Validators.compose([])],
        isTerminal: [false, Validators.compose([])],
        userId: ['', Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  submit(){
    if (this.createFormGroup.valid){
      let active = this.createFormGroup.controls.active.value;
      let product = {
        active: ((active === null || active === undefined || active === '' || active === false) ? false : true),
        isBillTo: this.createFormGroup.controls.isBillTo.value,
        isBroker: this.createFormGroup.controls.isBroker.value,
        isConsignee: this.createFormGroup.controls.isConsignee.value,
        isCustomer: this.createFormGroup.controls.isCustomer.value,
        isForwarder: this.createFormGroup.controls.isForwarder.value,
        isShipper: this.createFormGroup.controls.isShipper.value,
        isTerminal: this.createFormGroup.controls.isTerminal.value,
        location: {
          address1: this.createFormGroup.controls.locationAddress1.value,
          city: this.createFormGroup.controls.locationCity.value,
          country: this.createFormGroup.controls.locationCountry.value,
          externalId: this.createFormGroup.controls.locationExternalId.value,
          fax: this.createFormGroup.controls.locationFax.value,
          id: this.createFormGroup.controls.locationId.value,
          name: this.createFormGroup.controls.locationName.value,
          phone: this.createFormGroup.controls.locationPhone.value,
          state: this.createFormGroup.controls.locationState.value,
          zip: this.createFormGroup.controls.locationZip.value,
        },
        userId: this.createFormGroup.controls.userId.value,
      };
      this.typesService.storeProfile({...product})
        .pipe(shareReplay(), first())
        .subscribe((product: any) => {
          this.modalService.dismissAll();
          this.createFormGroup.reset();
          this.typesService.getAllProfiles(this.type, this.page);
        });
    }
  }

  subscribers(){
    this.countryService.countries$.subscribe((countries: any) => {
      this.countries = countries;
    })
    this.subscribeProduct()
    this.subscribeUsers()
  }

  subscribeProduct(){
    this.productSubscription = this.typesService.profiles$.subscribe((products: any) => {
      this.products =  products.results
      // console.log("products");
      // console.log(this.products);
      this.page = products.page;
      this.limit = products.limit;
      this.totalPages = products.totalPages;
      this.totalPagesArray = Array.from({length:this.totalPages},(v,k)=>k+1);
      this.totalResults = products.totalResults;
      this.reInitForm();
      this.ref.detectChanges();
    });
    this.typesService.getAllProfiles(this.type, this.page);
  }

  subscribeUsers(){
    this.usersSubscription = this.userManagementService.users$.subscribe((users: any) => {
      this.users =  users.results
      // console.log("users");
      // console.log(this.users);
      this.reInitForm();
      this.ref.detectChanges();
    });
    this.userManagementService.getAllUsers(1, 'active=true');
  }

  paginationClicked(pageNum: any){
    // console.log('clicked page num is : ' + pageNum);
    this.page = pageNum;
    this.typesService.getAllProfiles(this.type, this.page);
  }

  open(content: any){
      this.modalService.open(content, this.modalOptions).result.then((result) => {
    }, (reason) => {});
  }

  export(){
    this.typesService.exportProfiles(this.type);
  }

  filterSubmit(filters: any){
    let profileFilters:any = {};
    if(filters['active'])
      profileFilters['active'] = filters['active']
    if(filters['country'])
      profileFilters['location_country'] = filters['country']
    if(filters['search']){
      profileFilters['location_id'] = filters['search']
      profileFilters['location_name'] = filters['search']
      profileFilters['location_address1'] = filters['search']
      profileFilters['location_phone'] = filters['search']
      profileFilters['location_fax'] = filters['search']
      profileFilters['location_zip'] = filters['search']
      profileFilters['email'] = filters['search']
    }
    if(filters['state'])
      profileFilters['location_state'] = filters['state']
    var queryString = Object.keys(profileFilters).map(key => key + '=' + profileFilters[key]).join('&');
    // console.log('Profile Filter Submit');
    // console.log(queryString);
    this.typesService.getAllProfiles(this.type, 1, queryString);
  }

  resetFilter(){
    this.typesService.getAllProfiles(this.type, 1, '');
  }

  deleteProfile(profile: any){
    // console.log(profile)
    let profileLocationName = this.titleCasePipe.transform(profile?.location?.name);
    Swal.fire({
      title: 'Are you sure want to delete this profile ' + profileLocationName + ' ?',
      text: 'You will not be able to recover this profile',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete Profile',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#50CD89',
    }).then((result: any) => {
      if (result.value){
        this.typesService.deleteProfile(profile.id).pipe(shareReplay(), first())
          .subscribe((profile: any) => {
            this.typesService.getAllProfiles(this.type, 1, '');
          });
        Swal.fire({
          title: 'Deleted!',
          html: 'Your profile ' + profileLocationName + ' has been deleted.',
          icon: 'success',
          confirmButtonColor: '#50CD89'
        })
      } else if (result.dismiss === Swal.DismissReason.cancel){
        Swal.fire({
          title: 'Cancelled',
          html: 'Your profile ' + profileLocationName + ' is safe :)',
          icon: 'error',
          confirmButtonColor: '#50CD89'
        })
      }
    })
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
