import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {shareReplay, Subscription} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {LoadsService} from "../services/loads.service";
import {NgbModal, NgbModalOptions, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import * as _ from 'underscore';
import {TypesService} from "../../types/services/types.service";
import {DriversService} from "../../drivers/drivers.service";
import { environment } from 'src/environments/environment';
import Swal from "sweetalert2";
import {TitleCasePipe} from "@angular/common";
import {GoodsService} from "../../configurations/goods/goods.service";
import {ChargesService} from "../../configurations/charges/charges.service";

const MAX_LIMIT = `${environment.maxLimit}`;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  editLoadFormGroup: FormGroup;
  createGoodsFormGroup: FormGroup;
  editGoodsFormGroup: FormGroup;
  loadAssignedStatusFormGroup: FormGroup;
  inviteDriverFormGroup: FormGroup;
  createChargesFormGroup: FormGroup;
  editChargesFormGroup: FormGroup;
  summaryFormGroup: FormGroup;
  apiServerPath: String = environment.apiServerPath;
  private routeSub: Subscription;
  pageSlug: any = 'Loads';
  loadId: any;
  load: any;
  title = 'ng-bootstrap-modal-demo';
  modalOptions:NgbModalOptions;
  inviteDriverModalOptions:NgbModalOptions;
  ngbModalRef: NgbModalRef;
  customers: any[];
  drivers: any[];
  goods: any[];
  charges: any[];
  customerDestinations: any[];
  originShippers: any[];
  originShipperAddress: string;
  customerDestinationAddress: string;
  additionalCharges: any = 0;
  driverAdditionalCharges: any = 0;
  distanceMiles: any = 0;
  ratePerMile: any = 0;
  driverRatePerMile: any = 0;
  paidAmount: any = 0;
  balanceAmount: any = 0;
  summaryEdit: boolean = false;
  private driversSubscription: Subscription;
  private goodsSubscription: Subscription;
  private customersSubscription: Subscription;
  private originsSubscription: Subscription;
  private loadSubscription: Subscription;
  inviteDriverPopupHeading: String;
  isDriverInvite: boolean = false;
  isInterestedDriverInvited: boolean = false;
  maxLimit = MAX_LIMIT;

  constructor(
    private titleCasePipe: TitleCasePipe,
    private driverService: DriversService,
    private goodsService: GoodsService,
    private chargesService: ChargesService,
    private typeService: TypesService,
    private loadsService: LoadsService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ){
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      size:'xl'
    }
    this.inviteDriverModalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      size:'lg'
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribers();
  }

  subscribers(){
    this.subscribeLoad()
    this.subscribeCustomers()
    this.subscribeDrivers()
    this.subscribeGoods()
    this.subscribeCharges()
    this.subscribeOriginShippers()
  }

  subscribeLoad(){
    this.loadSubscription = this.loadsService.load$.subscribe((load: any) => {
      this.load =  load
      console.log("load");
      console.log(load);
      this.editLoadFormGroup.patchValue({
        customer: load?.customer?.id,
        proCode: load?.proCode,
        poHash: load?.poHash,
        shipperRef: load?.shipperRef,
        bolHash: load?.bolHash,
        origin: load?.origin?.id,
        destination: load?.destination?.id,
        notes: load?.notes,
      });
      this.inviteDriverFormGroup.patchValue({
        invitedDriver: load?.driver,
      });
      this.loadAssignedStatusFormGroup.patchValue({
        loadCreated: true,
        invitationSentToDriver: load?.invitationSentToDriver,
        acceptedByDriver: load?.isInviteAcceptedByDriver,
        onTheWayToDeliver: load?.onTheWayToDelivery,
        deliveredToCustomer: load?.deliveredToCustomer,
      });
      this.originShipperAddress = this.beautifyAddress(load?.origin);
      this.customerDestinationAddress = this.beautifyAddress(load?.destination);
      this.getChargesAdditionalCharges();
      this.getChargesDriverAdditionalCharges();
      this.distanceMiles = parseFloat(load?.distanceMiles)
      this.ratePerMile = parseFloat(load?.ratePerMile)
      this.driverRatePerMile = parseFloat(load?.driverRatePerMile)
      this.paidAmount = parseFloat(load?.paidAmount)
      this.balanceAmount = parseFloat(load?.balanceAmount)
      this.summaryFormGroup.patchValue({
        distanceMiles: this.distanceMiles,
        ratePerMile: this.ratePerMile,
        // paidAmount: this.paidAmount,
        // balanceAmount: this.balanceAmount,
      });
      this.ref.detectChanges();
      this.modalService.dismissAll();
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.loadId = params['id'];
      // this.loadId = params['id'];
      this.loadsService.getLoad(this.loadId);
    });
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

  subscribeDrivers(){
    this.driversSubscription = this.driverService.activeDriversToInvite$.subscribe((response: any) => {
      if(response?.results){
        this.drivers =  [...response.results]
        // console.log("drivers");
        // console.log(this.drivers);
        this.ref.detectChanges();
      }
    });
    this.driverService.getActiveDriversToInvite();
  }

  subscribeGoods(){
    this.goodsSubscription = this.goodsService.allActiveGoods$.subscribe((response: any) => {
      if(response?.results){
        this.goods =  [...response.results]
        // console.log("all active goods");
        // console.log(this.goods);
        this.ref.detectChanges();
      }
    });
    this.goodsService.getAllActiveGoods('limit='+this.maxLimit+'&active=true&sortBy=createdAtDateTime:desc');
  }

  subscribeCharges(){
    this.goodsSubscription = this.chargesService.allActiveCharges$.subscribe((response: any) => {
      if(response?.results){
        this.charges =  [...response.results]
        // console.log("all active charges");
        // console.log(this.charges);
        this.ref.detectChanges();
      }
    });
    this.chargesService.getAllActiveCharges('limit='+this.maxLimit+'&active=true&sortBy=createdAtDateTime:desc');
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

  initForm(){
    this.editLoadFormGroup = this.fb.group(
      {
        customer: ['',Validators.compose([Validators.required])],
        proCode: ['',Validators.compose([Validators.required])],
        poHash: ['',Validators.compose([Validators.required])],
        shipperRef: ['',Validators.compose([Validators.required])],
        bolHash: ['',Validators.compose([Validators.required])],
        origin: ['',Validators.compose([])],
        destination: ['',Validators.compose([])],
        notes: ['',Validators.compose([])],
      }
    );
    this.loadAssignedStatusFormGroup = this.fb.group(
      {
        loadCreated: ['',Validators.compose([])],
        invitationSentToDriver: ['',Validators.compose([])],
        acceptedByDriver: ['',Validators.compose([])],
        onTheWayToDeliver: ['',Validators.compose([])],
        deliveredToCustomer: ['',Validators.compose([])],
      }
    );
    this.inviteDriverFormGroup = this.fb.group(
      {
        invitedDriver: ['',Validators.compose([Validators.required])],
          ratePerMileOfDriver: ['',Validators.compose([])],
        updateRatePerMileOnDriverProfile: [false,Validators.compose([])],
      }
    );
    this.createGoodsFormGroup = this.fb.group(
      {
        make: ['',Validators.compose([Validators.required])],
        model: ['',Validators.compose([Validators.required])],
        year: ['',Validators.compose([Validators.required])],
        value: ['',Validators.compose([Validators.required])],
        quantity: ['',Validators.compose([Validators.required])],
        pieces: ['',Validators.compose([Validators.required])],
        userQuantity: ['',Validators.compose([Validators.required])],
        weight: ['',Validators.compose([Validators.required])],
        tonnage: ['',Validators.compose([Validators.required])],
        grWeight: ['',Validators.compose([Validators.required])],
        palletes: ['',Validators.compose([Validators.required])],
        frClass: ['',Validators.compose([Validators.required])],
        notes: ['',Validators.compose([Validators.required])],
        good: ['',Validators.compose([Validators.required])],
      }
    );
    this.editGoodsFormGroup = this.fb.group(
      {
        goodsId: ['',Validators.compose([Validators.required])],
        make: ['',Validators.compose([Validators.required])],
        model: ['',Validators.compose([Validators.required])],
        year: ['',Validators.compose([Validators.required])],
        value: ['',Validators.compose([Validators.required])],
        quantity: ['',Validators.compose([Validators.required])],
        pieces: ['',Validators.compose([Validators.required])],
        userQuantity: ['',Validators.compose([Validators.required])],
        weight: ['',Validators.compose([Validators.required])],
        tonnage: ['',Validators.compose([Validators.required])],
        grWeight: ['',Validators.compose([Validators.required])],
        palletes: ['',Validators.compose([Validators.required])],
        frClass: ['',Validators.compose([Validators.required])],
        notes: ['',Validators.compose([Validators.required])],
        good: ['',Validators.compose([Validators.required])],
      }
    );
    this.createChargesFormGroup = this.fb.group(
      {
        type: ['',Validators.compose([Validators.required])],
        notes: ['',Validators.compose([Validators.required])],
        rate: ['',Validators.compose([Validators.required])],
        quantity: ['',Validators.compose([Validators.required])],
        payableToDriver: [false,Validators.compose([])],
        billableToCustomer: [false,Validators.compose([])],
      }
    );

    this.editChargesFormGroup = this.fb.group(
      {
        chargesId: ['',Validators.compose([Validators.required])],
        type: ['',Validators.compose([Validators.required])],
        notes: ['',Validators.compose([Validators.required])],
        rate: ['',Validators.compose([Validators.required])],
        quantity: ['',Validators.compose([Validators.required])],
        payableToDriver: [false,Validators.compose([])],
        billableToCustomer: [false,Validators.compose([])],
      }
    );

    this.summaryFormGroup = this.fb.group(
      {
        distanceMiles: ['',Validators.compose([Validators.required])],
        ratePerMile: ['',Validators.compose([Validators.required])],
        // paidAmount: ['',Validators.compose([Validators.required])],
        // balanceAmount: ['',Validators.compose([Validators.required])],
      }
    );
  }

  update(options: any){
    let load: any = {};
    let allGoods = [...this.load?.goods];
    if(allGoods.length > 0){
      allGoods = allGoods.map(({_id, ...rest}) => {
        if(typeof rest.good !== "string"){
          let eachGoodId = rest.good.id
          rest.good = eachGoodId;
        }
        return rest;
      });
    }
    let allCharges = [...this.load?.charges];
    if(allCharges.length > 0){
      allCharges = allCharges.map(({_id, ...rest}) => {
        if(typeof rest.type !== "string"){
          let eachChargeTypeId = rest.type.id
          rest.type = eachChargeTypeId;
        }
        return rest;
      });
    }
    if (options?.editLoad && this.editLoadFormGroup.valid){
      // console.log('editLoadFormGroup VALID')
      load = {
        customer: this.editLoadFormGroup.controls.customer.value,
        proCode: this.editLoadFormGroup.controls.proCode.value,
        poHash: this.editLoadFormGroup.controls.poHash.value,
        shipperRef: this.editLoadFormGroup.controls.shipperRef.value,
        bolHash: this.editLoadFormGroup.controls.bolHash.value,
        origin: this.editLoadFormGroup.controls.origin.value,
        destination: this.editLoadFormGroup.controls.destination.value,
        notes: this.editLoadFormGroup.controls.notes.value,
        goods: [...allGoods]
      };
    }
    if (options?.inviteDriver && this.inviteDriverFormGroup.valid){
      // console.log('inviteDriverFormGroup VALID')
      load = {
        "invitationSentToDriver": true,
        "isInviteAcceptedByDriver": false,
        "onTheWayToDelivery": false,
        "deliveredToCustomer": false,
        "invitationSentToDriverId": this.inviteDriverFormGroup.controls.invitedDriver.value,
        // "invitationSentToDrivers": [
        //   {"id": this.inviteDriverFormGroup.controls.invitedDriver.value}
        // ],
        // "lastInvitedDriver": this.inviteDriverFormGroup.controls.invitedDriver.value,
        driverRatePerMile: 0,
      };
      if(this.inviteDriverFormGroup.controls.ratePerMileOfDriver.value !== ''){ // ratePerMileOfDriver updateRatePerMileOnDriverProfile
        load.driverRatePerMile = parseFloat(this.inviteDriverFormGroup.controls.ratePerMileOfDriver.value);
        // console.log('ratePerMileOfDriver');
        // console.log(load);
      }
      if(this.inviteDriverFormGroup.controls.updateRatePerMileOnDriverProfile.value === true){
        let driversRatePerMile = {
          ratePerMile: parseFloat(this.inviteDriverFormGroup.controls.ratePerMileOfDriver.value) // this is to update driver profile rate per mile
        }
        // update this to relevent driver profile
        // console.log('updateRatePerMileOnDriverProfile');
        // console.log(driversRatePerMile);
        this.driverService.updateDriver(this.inviteDriverFormGroup.controls.invitedDriver.value, driversRatePerMile)
          .pipe(shareReplay(), first())
          .subscribe((driver: any) => {
            // this.editDriverFormGroup.reset();
            // this.driversService.getDriver(this.driverId);
            this.driverService.getActiveDriversToInvite();
          });
      }
    }
    if (options?.createGoods && this.createGoodsFormGroup.valid){
      // console.log('createGoodsFormGroup VALID')
      allGoods.push({
        make: this.createGoodsFormGroup.controls.make.value,
        model: this.createGoodsFormGroup.controls.model.value,
        year: this.createGoodsFormGroup.controls.year.value,
        value: this.createGoodsFormGroup.controls.value.value,
        quantity: this.createGoodsFormGroup.controls.quantity.value,
        pieces: this.createGoodsFormGroup.controls.pieces.value,
        userQuantity: this.createGoodsFormGroup.controls.userQuantity.value,
        weight: this.createGoodsFormGroup.controls.weight.value,
        tonnage: this.createGoodsFormGroup.controls.tonnage.value,
        grWeight: this.createGoodsFormGroup.controls.grWeight.value,
        palletes: this.createGoodsFormGroup.controls.palletes.value,
        frClass: this.createGoodsFormGroup.controls.frClass.value,
        notes: this.createGoodsFormGroup.controls.notes.value,
        good: this.createGoodsFormGroup.controls.good.value,
      });
      if(allGoods.length > 0){
        load = {
          goods: [...allGoods]
        }
      }
    }
    if (options?.updateGoods || this.editGoodsFormGroup.valid){
      // console.log('editGoodsFormGroup VALID')
      if(allGoods.length > 0){
        load = {
          goods: [...allGoods]
        }
      }
    }
    if (options?.deleteGoods){
      // console.log('editGoodsFormGroup VALID')
      load = {
        goods: [...allGoods]
      }
    }
    if (options?.createCharges && this.createChargesFormGroup.valid){
      // console.log('createChargesFormGroup VALID')
      allCharges.push({
        type: this.createChargesFormGroup.controls.type.value,
        notes: this.createChargesFormGroup.controls.notes.value,
        rate: this.createChargesFormGroup.controls.rate.value,
        quantity: this.createChargesFormGroup.controls.quantity.value,
        payableToDriver: this.createChargesFormGroup.controls.payableToDriver.value,
        billableToCustomer: this.createChargesFormGroup.controls.billableToCustomer.value,
      });
      if(allCharges.length > 0){
        load = {
          charges: [...allCharges]
        }
      }
    }
    if (options?.updateCharges && this.editChargesFormGroup.valid){
      // console.log('editChargesFormGroup VALID')
      if(allCharges.length > 0){
        load = {
          charges: [...allCharges]
        }
      }
    }
    if (options?.deleteCharges){
      // console.log('deleteCharges log')
        load = {
          charges: [...allCharges]
        }
    }
    if (options?.updateSummary && this.summaryFormGroup.valid){
      // console.log('summaryFormGroup VALID')
      load = {
        distanceMiles: this.summaryFormGroup.controls.distanceMiles.value,
        ratePerMile: this.summaryFormGroup.controls.ratePerMile.value,
        // paidAmount: this.summaryFormGroup.controls.paidAmount.value,
        // balanceAmount: this.summaryFormGroup.controls.balanceAmount.value,
      }
    }
    if (options?.updateTender){
      // console.log('updateTender CALLED')
      load = {
        status: 'tender'
      }
    }
    if(Object.keys(load).length > 0){
      // console.log('LOAD send to update is')
      // console.log(load)
      this.loadsService.updateLoad(this.loadId, {...load})
        .pipe(shareReplay(), first())
        .subscribe((load: any) => {
          this.editLoadFormGroup.reset();
          this.inviteDriverFormGroup.reset();
          this.createGoodsFormGroup.reset();
          this.editGoodsFormGroup.reset();
          this.createChargesFormGroup.reset();
          // this.loadAssignedStatusFormGroup.reset();
          this.loadsService.getLoad(this.loadId);
        });
    }
  }

  updateGoods(){
    let goodsIndex = this.load.goods.findIndex(((obj: any) => obj._id == this.editGoodsFormGroup.controls.goodsId.value));
    this.load.goods[goodsIndex].make = this.editGoodsFormGroup.controls.make.value
    this.load.goods[goodsIndex].model = this.editGoodsFormGroup.controls.model.value
    this.load.goods[goodsIndex].year = this.editGoodsFormGroup.controls.year.value
    this.load.goods[goodsIndex].value = this.editGoodsFormGroup.controls.value.value
    this.load.goods[goodsIndex].quantity = this.editGoodsFormGroup.controls.quantity.value
    this.load.goods[goodsIndex].pieces = this.editGoodsFormGroup.controls.pieces.value
    this.load.goods[goodsIndex].userQuantity = this.editGoodsFormGroup.controls.userQuantity.value
    this.load.goods[goodsIndex].weight = this.editGoodsFormGroup.controls.weight.value
    this.load.goods[goodsIndex].tonnage = this.editGoodsFormGroup.controls.tonnage.value
    this.load.goods[goodsIndex].grWeight = this.editGoodsFormGroup.controls.grWeight.value
    this.load.goods[goodsIndex].palletes = this.editGoodsFormGroup.controls.palletes.value
    this.load.goods[goodsIndex].frClass = this.editGoodsFormGroup.controls.frClass.value
    this.load.goods[goodsIndex].notes = this.editGoodsFormGroup.controls.notes.value
    this.load.goods[goodsIndex].good = this.editGoodsFormGroup.controls.good.value
    this.update({updateGoods: true});
  }

  updateCharges(){
    let chargesIndex = this.load?.charges.findIndex(((obj: any) => obj._id == this.editChargesFormGroup.controls.chargesId.value));
    this.load.charges[chargesIndex].type = this.editChargesFormGroup.controls.type.value
    this.load.charges[chargesIndex].notes = this.editChargesFormGroup.controls.notes.value
    this.load.charges[chargesIndex].rate = this.editChargesFormGroup.controls.rate.value
    this.load.charges[chargesIndex].quantity = this.editChargesFormGroup.controls.quantity.value
    this.load.charges[chargesIndex].payableToDriver = this.editChargesFormGroup.controls.payableToDriver.value
    this.load.charges[chargesIndex].billableToCustomer = this.editChargesFormGroup.controls.billableToCustomer.value
    this.update({updateCharges: true});
  }

  updateSummary(){
    // if(this.parseFloat(this.summaryFormGroup.controls.distanceMiles.value) > 0 && this.parseFloat(this.summaryFormGroup.controls.ratePerMile.value) > 0){
      this.distanceMiles = this.parseFloat(this.summaryFormGroup.controls.distanceMiles.value);
      this.ratePerMile = this.parseFloat(this.summaryFormGroup.controls.ratePerMile.value);
      // this.paidAmount = this.parseFloat(this.summaryFormGroup.controls.paidAmount.value);
      // this.balanceAmount = this.parseFloat(this.summaryFormGroup.controls.balanceAmount.value);
      this.update({updateSummary: true});
    // }
  }

  getChargesAdditionalCharges(){
    if(this.load && Object.keys(this.load).length > 0 && this.load?.charges.length > 0){
      this.additionalCharges = 0;
      // console.log('getChargesAdditionalCharges');
      // console.log(this.load?.charges);
      this.load?.charges.forEach((charge: any, index: any) => {
        this.additionalCharges = this.parseFloat(this.parseFloat(this.additionalCharges) + (this.parseFloat(charge.rate) * this.parseFloat(charge.quantity))).toFixed(2)
      });
      // return this.additionalCharges;
    }
    // return 0;
  }

  getChargesDriverAdditionalCharges(){
    if(this.load && Object.keys(this.load).length > 0 && this.load?.charges.length > 0){
      this.driverAdditionalCharges = 0;
      // console.log('getChargesDriverAdditionalCharges');
      // console.log(this.load?.charges);
      this.load?.charges.forEach((charge: any, index: any) => {
        // console.log('EACH CAHRGE')
        // console.log(charge)
        if(charge.payableToDriver === true)
          this.driverAdditionalCharges = this.parseFloat(this.parseFloat(this.driverAdditionalCharges) + (this.parseFloat(charge.rate) * this.parseFloat(charge.quantity))).toFixed(2)
      });
      // return this.driverAdditionalCharges;
    }
    // return 0;
  }

  fillGoodsEditForm(goods: any){
    this.editGoodsFormGroup.patchValue({
      goodsId: goods?._id,
      make: goods?.make,
      model: goods?.model,
      year: goods?.year,
      value: goods?.value,
      quantity: goods?.quantity,
      pieces: goods?.pieces,
      userQuantity: goods?.userQuantity,
      weight: goods?.weight,
      tonnage: goods?.tonnage,
      grWeight: goods?.grWeight,
      palletes: goods?.palletes,
      frClass: goods?.frClass,
      notes: goods?.notes,
      good: goods?.good?.id,
    });
  }

  fillChargesEditForm(charges: any){
    this.editChargesFormGroup.patchValue({
      chargesId: charges?._id,
      type: charges?.type?.id,
      rate: charges?.rate,
      quantity: charges?.quantity,
      total: charges?.total,
      billableToCustomer: charges?.billableToCustomer,
      payableToDriver: charges?.payableToDriver,
      notes: charges?.notes,
    });
  }

  deleteCharge(charges: any){
    let chargesName = this.titleCasePipe.transform(charges?.type?.name);
    Swal.fire({
      title: 'Are you sure want to delete this Charge ' + chargesName + ' ?',
      text: 'You will not be able to recover this Charge',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete Charge',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#50CD89',
    }).then((result: any) => {
      if (result.value){
        this.load?.charges.splice(this.load?.charges.findIndex(function(i: any){
          return i._id === charges._id;
        }), 1);
        this.update({deleteCharges: true});
        Swal.fire({
          title: 'Deleted!',
          html: 'Your Charge ' + chargesName + ' has been deleted.',
          icon: 'success',
          confirmButtonColor: '#50CD89'
        })
      } else if (result.dismiss === Swal.DismissReason.cancel){
        Swal.fire({
          title: 'Cancelled',
          html: 'Your Charge ' + chargesName + ' is safe :)',
          icon: 'error',
          confirmButtonColor: '#50CD89'
        })
      }
    })
  }

  deleteGoods(goods: any){
    let goodsName = this.titleCasePipe.transform(goods.make)+' '+this.titleCasePipe.transform(goods.model);
    Swal.fire({
      title: 'Are you sure want to delete this Good ' + goodsName + ' ?',
      text: 'You will not be able to recover this Good',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete Good',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#50CD89',
    }).then((result: any) => {
      if (result.value){
        this.load.goods.splice(this.load.goods.findIndex(function(i: any){
          return i._id === goods._id;
        }), 1);
        // console.log('deleteGoods');
        // console.log({...this.load.goods});
        this.update({deleteGoods: true});
        Swal.fire({
          title: 'Deleted!',
          html: 'Your Good ' + goodsName + ' has been deleted.',
          icon: 'success',
          confirmButtonColor: '#50CD89'
        })
      } else if (result.dismiss === Swal.DismissReason.cancel){
        Swal.fire({
          title: 'Cancelled',
          html: 'Your Good ' + goodsName + ' is safe :)',
          icon: 'error',
          confirmButtonColor: '#50CD89'
        })
      }
    })
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
      this.editLoadFormGroup.patchValue({
        destination: objectId
      });
      this.updateDestinationAddress(objectId)
    }
  }

  onOriginShipperChange(objectId: any) {
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

  ngOnDestroy(){
    this.routeSub.unsubscribe();
    this.loadSubscription.unsubscribe();
    this.customersSubscription.unsubscribe();
    this.driversSubscription.unsubscribe();
    this.originsSubscription.unsubscribe();
  }

  open(content: any){
    this.createChargesFormGroup.patchValue({
      payableToDriver: false,
      billableToCustomer: false,
    });
    this.modalService.open(content, this.modalOptions).result.then((result) => {
    }, (reason) => {
    });
  }

  interestedDriverInvited(interestedDriver: any){
    this.isInterestedDriverInvited = true;
    this.selectedDriverToSendInvite = interestedDriver?.id;
    this.inviteDriverFormGroup.patchValue({
      invitedDriver: interestedDriver?.id?.id
    });
    this.inviteDriverFormGroup.patchValue({
      ratePerMileOfDriver: interestedDriver?.id?.ratePerMile
    });
    this.hideUpdateRatePerMileInput = false;
  }

  openInterestedDrivers(content: any){
    this.isDriverInvite = false;
    this.isInterestedDriverInvited = false;
    this.inviteDriverPopupHeading = 'Interested Drivers';
    this.hideUpdateRatePerMileInput = true
    this.hideUpdateRatePerMileToggleOnDriverProfile = true
    this.modalService.open(content, this.inviteDriverModalOptions).result.then(
      (result) => {
      }, (reason) => {
      });
  }

  openInviteDriver(content: any){
    this.isDriverInvite = true;
    this.isInterestedDriverInvited = false;
    this.inviteDriverPopupHeading = 'Invite Driver';
    this.hideUpdateRatePerMileInput = true
    this.hideUpdateRatePerMileToggleOnDriverProfile = true
    this.modalService.open(content, this.inviteDriverModalOptions).result.then((result) => {
    }, (reason) => {
    });
  }

  beautifyAddress(Obj: any){
    return this.loadsService.beautifyAddress(Obj);
  }

  parseFloat(number: any){
    return parseFloat(number);
  }

  summaryEditClicked(){
    this.summaryEdit = !this.summaryEdit;
  }

  selectedDriverToSendInvite: any;
  hideUpdateRatePerMileToggleOnDriverProfile: any = true;
  hideUpdateRatePerMileInput: any = true;

  changeDriverInvite(driver: any){
    this.hideUpdateRatePerMileToggleOnDriverProfile = true
    this.hideUpdateRatePerMileInput = false
    // console.log('changeDriverInvite');
    // console.log(driver);
    let inviteClickedDriverObjId = driver.target.value
    // console.log(inviteClickedDriverObjId);
    let inviteClickedDriver = _.find(this.drivers, (driver) => {
      return inviteClickedDriverObjId === driver.id;
    })
    // console.log(inviteClickedDriver);
    this.selectedDriverToSendInvite = inviteClickedDriver;
    this.inviteDriverFormGroup.patchValue({
      ratePerMileOfDriver: this.selectedDriverToSendInvite.ratePerMile
    });
  }

  checkRatePerMileOfInvitedDriver(ratePerMile: any){
    // console.log('checkRatePerMileOfInvitedDriver');
    // console.log(ratePerMile);
    if(this.selectedDriverToSendInvite.ratePerMile !== ratePerMile.value){
      this.hideUpdateRatePerMileToggleOnDriverProfile = false
    }else{
      this.hideUpdateRatePerMileToggleOnDriverProfile = true
    }
  }

  tenderClicked(load:any){
    if(load?.status === 'pending'){
      this.update({updateTender: true});
    }
  }

}


