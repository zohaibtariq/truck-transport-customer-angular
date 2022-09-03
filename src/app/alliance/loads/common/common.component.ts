import { Component, Input } from '@angular/core';
import {LoadsService} from "../services/loads.service";
import {first} from "rxjs/operators";
import {ConfirmPasswordValidator} from "../../../modules/auth";
import {shareReplay, Subscription} from "rxjs";
import {ChangeDetectorRef} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {TitleCasePipe} from '@angular/common';
import {TypesService} from "../../types/services/types.service";
import * as _ from "underscore";

@Component({
  selector: 'app-loads-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export class CommonComponent {

  createFormGroup: FormGroup;
  @Input() heading = '';
  @Input() status: any;
  loads: any[];
  customers: any[];
  customerDestinations: any[];
  originShippers: any[];
  originShipperAddress: string;
  customerDestinationAddress: string;
  private loadSubscription: Subscription;
  private customersSubscription: Subscription;
  private originsSubscription: Subscription;
  title = 'ng-bootstrap-modal-demo';
  modalOptions:NgbModalOptions;
  page: any = 1;
  limit: any;
  totalPages: any;
  totalPagesArray: any;
  totalResults: any;
  pageSlug: any;

  constructor(
    private typeService: TypesService,
    private loadsService: LoadsService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private titleCasePipe: TitleCasePipe,
  ){
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      size:'lg'
    }
  }

  ngOnInit(): void {
    // this.statusKey = Object.keys(this.status)[0];
    this.subscribers()
    this.initForm();
    this.pageSlug = this.heading.toLowerCase().replace(' ', '-')
  }

  ngOnDestroy(){
    this.loadSubscription.unsubscribe();
    this.customersSubscription.unsubscribe();
    this.originsSubscription.unsubscribe();
  }

  initForm(){
    this.createFormGroup = this.fb.group(
      {
        customer: ['',Validators.compose([Validators.required])],
        proCode: ['',Validators.compose([Validators.required])],
        poHash: ['',Validators.compose([Validators.required])],
        shipperRef: ['',Validators.compose([Validators.required])],
        bolHash: ['',Validators.compose([Validators.required])],
        origin: ['',Validators.compose([])],
        destination: ['',Validators.compose([])],
      }
    );
  }

  submit(){
    if (this.createFormGroup.valid){
      let load = {
        customer: this.createFormGroup.controls.customer.value,
        proCode: this.createFormGroup.controls.proCode.value,
        poHash: this.createFormGroup.controls.poHash.value,
        shipperRef: this.createFormGroup.controls.shipperRef.value,
        bolHash: this.createFormGroup.controls.bolHash.value,
        origin: this.createFormGroup.controls.origin.value,
        destination: this.createFormGroup.controls.destination.value,
      };
      this.loadsService.storeLoad({...load})
        .pipe(shareReplay(), first())
        .subscribe((load: any) => {
          this.modalService.dismissAll();
          this.createFormGroup.reset();
          this.loadsService.getAllLoads(this.status, this.page);
        });
    }
  }

  subscribers(){
    this.subscribeLoad()
    // this.subscribeUsers()
    this.subscribeCustomers()
    this.subscribeOriginShippers()
  }

  subscribeLoad(){
    this.loadSubscription = this.loadsService.loads$.subscribe((loads: any) => {
      if(loads?.results){
        this.loads =  loads.results
        // console.log("loads");
        // console.log(this.loads);
        this.page = loads.page;
        this.limit = loads.limit;
        this.totalPages = loads.totalPages;
        this.totalPagesArray = Array.from({length:this.totalPages},(v,k)=>k+1);
        this.totalResults = loads.totalResults;
        this.ref.detectChanges();
      }
    });
    this.loadsService.getAllLoads(this.status, this.page);
  }

  subscribeCustomers(){
    this.customersSubscription = this.typeService.customers$.subscribe((response: any) => {
      if(response?.results){
        this.customers =  [...response.results]
        this.customerDestinations =  [...response.results]
        // console.log("customers");
        // console.log(this.customers);
        // console.log("customerDestinations");
        // console.log(this.customerDestinations);
        this.ref.detectChanges();
      }
    });
    this.typeService.getCustomerProfiles();
  }

  subscribeOriginShippers(){
    this.originsSubscription = this.typeService.shippers$.subscribe((response: any) => {
      if(response?.results){
        this.originShippers = [...response.results]
        // console.log("subscribeOriginShippers->originShippers");
        // console.log(this.originShippers);
        this.ref.detectChanges();
      }
    });
    this.typeService.getShipperProfiles();
  }

  onDestinationChange(id: any){
    if(id){
      this.updateDestinationAddress(id)
      // this.updateDestinationAddress(id.target.value)
    }
  }

  onCustomerChange(objectId: any){
    if(objectId){
      // let objectId = id.target.value
      this.createFormGroup.patchValue({
        destination: objectId
      });
      this.updateDestinationAddress(objectId)
    }
  }

  onOriginShipperChange(objectId: any){
    // let objectId = id.target.value
    if(objectId) {
      let originAddress = _.find(this.originShippers, (originShipper) => {
        return objectId === originShipper.id;
      })
      // console.log('onOriginShipperChange');
      // console.log(objectId);
      // console.log(originAddress);
      this.originShipperAddress = this.loadsService.beautifyAddress(originAddress);
    }
  }

  updateDestinationAddress(objectId: any){
    // console.log('updateDestinationAddress');
    // console.log(objectId);
    let destinationAddress = _.find(this.customers, (customer) => {
      return objectId === customer.id;
    })
    // console.log(destinationAddress);
    this.customerDestinationAddress = this.loadsService.beautifyAddress(destinationAddress);
  }

  paginationClicked(pageNum: any){
    // console.log('clicked page num is : ' + pageNum);
    this.page = pageNum;
    this.loadsService.getAllLoads(this.status, this.page);
  }

  open(content: any){
    this.originShipperAddress = '';
    this.customerDestinationAddress = '';
      this.modalService.open(content, this.modalOptions).result.then((result) => {
    }, (reason) => {});
  }

  export(){
    this.loadsService.exportProfiles(this.status);
  }

  filterSubmit(filters: any){
    // console.log('filterSubmit');
    // console.log(filters);
    let loadFilters:any = {};
    if(filters['search'])
      loadFilters['search'] = filters['search']
    var queryString = Object.keys(loadFilters).map(key => key + '=' + loadFilters[key]).join('&');
    this.loadsService.getAllLoads(this.status, 1, queryString);
  }

  resetFilter(){
    this.loadsService.getAllLoads(this.status, 1, '');
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
        this.loadsService.deleteLoad(profile.id).pipe(shareReplay(), first())
          .subscribe((profile: any) => {
            this.loadsService.getAllLoads(this.status, 1, '');
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

  beautifyAddress(Obj: any){
    return this.loadsService.beautifyAddress(Obj);
  }

}
