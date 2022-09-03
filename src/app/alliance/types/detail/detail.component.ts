import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {shareReplay, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {TypesService} from "../services/types.service";
import {NgbModal, NgbModalOptions, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmPasswordValidator} from "../../../modules/auth";
import {first} from "rxjs/operators";
import Swal from "sweetalert2";
import {TitleCasePipe} from '@angular/common';
import {UserManagementService} from "../../user-management/user-management.service";
import * as _ from 'underscore';
import {ContactPersonCSVModel} from "./ContactPersonCSVModel";
import {CountryService} from "../../../global/services/country.service";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  editFormGroup: FormGroup;
  createContactFormGroup: FormGroup;
  editContactFormGroup: FormGroup;
  private productSubscription: Subscription;
  private routeSub: Subscription;
  pageSlug: any = '';
  typeId: any;
  product: any;
  title = 'ng-bootstrap-modal-demo';
  modalOptions:NgbModalOptions;
  ngbModalRef: NgbModalRef;
  user: any;
  users: any[];
  private usersSubscription: Subscription;
  countries: any[];
  countryIsoCode: any = '';
  states: any[];
  stateIsoCode: any = '';
  cities: any[];

  constructor(
    private typesService: TypesService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.initForm();
    this.subscribers()
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

  initForm(){
    this.editFormGroup = this.fb.group(
      {
        code: [
          '',
          Validators.compose([]),
        ],
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
        email: ['', Validators.compose([])],
        mcId: ['', Validators.compose([])],
        ediId: ['', Validators.compose([])],
        officeHours: ['', Validators.compose([])],
        notes: ['', Validators.compose([])],
        userId: ['', Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
    this.createContactFormGroup = this.fb.group(
      {
        contactPerson: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        contactType: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        contactPhone: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        contactFax: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        contactEmail: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
      }
    );
    this.editContactFormGroup = this.fb.group(
      {
        contactPersonId: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        contactPerson: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        contactType: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        contactPhone: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        contactFax: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        contactEmail: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
      }
    );
  }

  subscribers(){
    this.subscribeProduct()
    this.subscribeUsers()
  }

  subscribeProduct(){
    this.countryService.countries$.subscribe((countries: any) => {
      // console.log('COUNTRIES POPULATED')
      this.countries = countries;
    })
    this.productSubscription = this.typesService.profile$.subscribe((product: any) => {
      this.product = product
      // console.log('TYPE PROD DATA');
      // console.log(this.product)
      // setTimeout(() => {
      //   do{
      //     console.log('WORKING DO...')
      //     setTimeout(() => {
            if(this.countries.length > 0 && product?.location?.country?._id !== undefined){
              if(product?.location?.state?._id !== undefined){
                this.onCountryChange({target:{value: product?.location?.country?._id}}, () => {
                  this.editFormGroup.patchValue({
                    locationState: product?.location?.state?._id,
                  });
                  if(this.states.length > 0 && product?.location?.city?._id !== undefined){
                    this.onStateChange({target:{value: product?.location?.state?._id}}, () => {
                      this.editFormGroup.patchValue({
                        locationCity: product?.location?.city?._id,
                      });
                    })
                  }
                })
              }
            }
          // }, 1500);
        // }
        // while(this.countries === undefined || this.states === undefined || this.countries.length === 0 || this.states.length === 0)
      // }, 3000)
      this.editFormGroup.patchValue({
        code: product?.code,
        active: product?.active === true,
        isBillTo: product?.isBillTo === true,
        isBroker: product?.isBroker === true,
        isConsignee: product?.isConsignee === true,
        isCustomer: product?.isCustomer === true,
        isForwarder: product?.isForwarder === true,
        isShipper: product?.isShipper === true,
        isTerminal: product?.isTerminal === true,
        locationAddress1: product?.location?.address1,
        locationCountry: product?.location?.country?._id,
        locationState: product?.location?.state?._id,
        locationCity: product?.location?.city?._id,
        locationExternalId: product?.location?.externalId,
        locationFax: product?.location?.fax,
        locationId: product?.location?.id,
        locationName: product?.location?.name,
        locationPhone: product?.location?.phone,
        locationZip: product?.location?.zip,
        email: product?.email,
        mcId: product?.mcId,
        ediId: product?.ediId,
        notes: product?.notes,
        officeHours: product?.officeHours,
        userId: product?.userId,
      });
      this.modalService.dismissAll();
      this.getSalesPerson();
      this.ref.detectChanges();
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.typeId = params['id'];
      this.pageSlug = params['pageSlug'];
      this.typesService.getProfile(this.typeId);
    });
  }

  subscribeUsers(){
    this.usersSubscription = this.userManagementService.users$.subscribe((users: any) => {
      this.users =  users.results
      this.ref.detectChanges();
      this.getSalesPerson();
    });
    this.userManagementService.getAllUsers(1, 'active=true');
  }

  updateContactPerson(){
    let contactPersonIndex = this.product.contactPersons.findIndex(((obj: any) => obj._id == this.editContactFormGroup.controls.contactPersonId.value));
    this.product.contactPersons[contactPersonIndex].name = this.editContactFormGroup.controls.contactPerson.value
    this.product.contactPersons[contactPersonIndex].type = this.editContactFormGroup.controls.contactType.value
    this.product.contactPersons[contactPersonIndex].phone = this.editContactFormGroup.controls.contactPhone.value
    this.product.contactPersons[contactPersonIndex].fax = this.editContactFormGroup.controls.contactFax.value
    this.product.contactPersons[contactPersonIndex].email = this.editContactFormGroup.controls.contactEmail.value
    this.editContactFormGroup.reset();
    this.update();
  }

  getSalesPerson(){
    if(this.users && this.users.length > 0 && this.product){
      this.user = _.find(this.users, (user) => {
        return user.id === this.product.userId;
      })
      if(this.user !== undefined)
        this.ref.detectChanges();
    }
  }

  update(){
    let allContactPersons = [...this.product.contactPersons];
    if(allContactPersons.length > 0)
      allContactPersons = allContactPersons.map(({_id, ...rest}) => {
        return rest;
      });
    if (this.createContactFormGroup.valid){
      allContactPersons.push({
        name: this.createContactFormGroup.controls.contactPerson.value,
        type: this.createContactFormGroup.controls.contactType.value,
        phone: this.createContactFormGroup.controls.contactPhone.value,
        fax: this.createContactFormGroup.controls.contactFax.value,
        email: this.createContactFormGroup.controls.contactEmail.value
      });
      this.createContactFormGroup.reset();
    }
    if (this.editFormGroup.valid){
      let product = {
        active: this.editFormGroup.controls.active.value,
        isBillTo: this.editFormGroup.controls.isBillTo.value,
        isBroker: this.editFormGroup.controls.isBroker.value,
        isConsignee: this.editFormGroup.controls.isConsignee.value,
        isCustomer: this.editFormGroup.controls.isCustomer.value,
        isForwarder: this.editFormGroup.controls.isForwarder.value,
        isShipper: this.editFormGroup.controls.isShipper.value,
        isTerminal: this.editFormGroup.controls.isTerminal.value,
        contactPersons: allContactPersons,
        location: {
          country: this.editFormGroup.controls.locationCountry.value,
          state: this.editFormGroup.controls.locationState.value,
          city: this.editFormGroup.controls.locationCity.value,
          address1: this.editFormGroup.controls.locationAddress1.value,
          externalId: this.editFormGroup.controls.locationExternalId.value,
          fax: this.editFormGroup.controls.locationFax.value,
          id: this.editFormGroup.controls.locationId.value,
          name: this.editFormGroup.controls.locationName.value,
          phone: this.editFormGroup.controls.locationPhone.value,
          zip: this.editFormGroup.controls.locationZip.value,
        },
        email: this.editFormGroup.controls.email.value,
        mcId: this.editFormGroup.controls.mcId.value,
        ediId: this.editFormGroup.controls.ediId.value,
        notes: this.editFormGroup.controls.notes.value,
        officeHours: this.editFormGroup.controls.officeHours.value,
        userId: this.editFormGroup.controls.userId.value,
      };
      // console.log({...product});
      // return false;
      this.typesService.updateProfile(this.typeId, {...product})
        .pipe(shareReplay(), first())
        .subscribe((product: any) => {
          this.fileReset();
          this.editFormGroup.reset();
          this.typesService.getProfile(this.typeId);
        });
    }
  }

  fillContactPersonEditForm(contactPerson: any){
    this.editContactFormGroup.patchValue({
      contactPersonId: contactPerson?._id,
      contactPerson: contactPerson?.name,
      contactType: contactPerson?.type,
      contactPhone: contactPerson?.phone,
      contactFax: contactPerson?.fax,
      contactEmail: contactPerson?.email,
    });
  }

  ngOnDestroy(){
    this.routeSub.unsubscribe();
    this.productSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }

  open(content: any){
    this.modalService.open(content, this.modalOptions).result.then((result) => {
    }, (reason) => {
    });
  }

  export(){
    this.typesService.exportProfilesContactPerson(this.pageSlug, this.typeId);
  }

  deleteContactPerson(contactPerson: any){
    let contactPersonName = this.titleCasePipe.transform(contactPerson.name);
    Swal.fire({
      title: 'Are you sure want to delete this Contact person ' + contactPersonName + ' ?',
      text: 'You will not be able to recover this Contact person',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete Contact person',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#50CD89',
    }).then((result: any) => {
      if (result.value){
        this.product.contactPersons.splice(this.product.contactPersons.findIndex(function(i: any){
          return i._id === contactPerson._id;
        }), 1);
        this.update();
        Swal.fire({
          title: 'Deleted!',
          html: 'Your Contact person ' + contactPersonName + ' has been deleted.',
          icon: 'success',
          confirmButtonColor: '#50CD89'
        })
      } else if (result.dismiss === Swal.DismissReason.cancel){
        Swal.fire({
          title: 'Cancelled',
          html: 'Your Contact person ' + contactPersonName + ' is safe :)',
          icon: 'error',
          confirmButtonColor: '#50CD89'
        })
      }
    })
  }

  /*
  * IMPORT CONTACT PERSON
  * */

  public importContactPersonError: string;
  public importContactPersonSuccess: string;
  @ViewChild('csvReader') csvReader: any;

  uploadListener($event: any): void {
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])){
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        let csvData = reader.result;
        let TypeCSVModelsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(TypeCSVModelsArray);
        this.getDataRecordsArrayFromCSVFile(TypeCSVModelsArray, headersRow.length);
        this.update();
      };
      reader.onerror = function (){
      };
    } else {
      alert("Please import valid profile .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(TypeCSVModelsArray: any, headerLength: any){
    for (let i = 1; i < TypeCSVModelsArray.length; i++){
      let currentRecord = (<string>TypeCSVModelsArray[i]).split(',');
      if (currentRecord.length == headerLength){
        let contactPersonCSVRecord: ContactPersonCSVModel = new ContactPersonCSVModel();
        contactPersonCSVRecord.name = currentRecord[0].trim().replace(/["']/g, "");
        contactPersonCSVRecord.type = currentRecord[1].trim().replace(/["']/g, "");
        contactPersonCSVRecord.phone = currentRecord[2].trim().replace(/["']/g, "");
        contactPersonCSVRecord.fax = currentRecord[3].trim().replace(/["']/g, "");
        contactPersonCSVRecord.email = currentRecord[4].trim().replace(/["']/g, "");
        this.product.contactPersons.push(contactPersonCSVRecord);
      }
    }
  }

  isValidCSVFile(file: any){
    return file.name.endsWith(".csv");
  }

  getHeaderArray(TypeCSVModelsArr: any){
    let headers = (<string>TypeCSVModelsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++){
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset(){
    this.csvReader.nativeElement.value = "";
    this.importContactPersonError = '';
    this.importContactPersonSuccess = '';
  }

}
