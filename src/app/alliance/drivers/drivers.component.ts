import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {first} from "rxjs/operators";
import {shareReplay, Subscription} from "rxjs";
import {ChangeDetectorRef} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DriversService} from "./drivers.service";

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {

  createDriverFormGroup: FormGroup;
  heading = 'Drivers';
  drivers: any[];
  private driverSubscription: Subscription;
  title = 'ng-bootstrap-modal-demo';
  modalOptions:NgbModalOptions;
  page: any = 1;
  limit: any;
  totalPages: any;
  totalPagesArray: any;
  totalResults: any;

  constructor(
    private driversService: DriversService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder
  ){
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      size:'xl'
    }
  }

  ngOnInit(): void {
    this.subscribeDriver()
    this.initForm();
  }

  ngOnDestroy(){
    this.driverSubscription.unsubscribe();
  }

  initForm(){
    this.createDriverFormGroup = this.fb.group(
      {
        code: [
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
      }
    );
  }

  submit(){
    if (this.createDriverFormGroup.valid){
      let driver = {
        code: this.createDriverFormGroup.controls.code.value,
        active: this.createDriverFormGroup.controls.active.value,
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

  filterSubmit(queryString: any){
    // console.log('Driver : filterSubmit');
    // console.log(queryString);
    queryString = queryString.replaceAll('location_', '');
    // console.log(queryString);
    this.driversService.getAllDrivers(1, queryString);
  }

  resetFilter(){
    this.driversService.getAllDrivers(1, '');
  }

}
