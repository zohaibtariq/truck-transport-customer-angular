import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {shareReplay, Subscription} from "rxjs";
import {ChangeDetectorRef} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from 'sweetalert2';
import {TitleCasePipe} from '@angular/common';
import {ChargesService} from "./charges.service";

@Component({
  selector: 'app-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss']
})
export class ChargesComponent implements OnInit {

  createChargeFormGroup: FormGroup;
  editChargeFormGroup: FormGroup;
  createChargeFormError: any;
  editChargeFormError: any;
  charges: any[];
  private chargeSubscription: Subscription;
  title = 'ng-bootstrap-modal-demo';
  modalOptions:NgbModalOptions;
  page: any = 1;
  limit: any;
  totalPages: any;
  totalPagesArray: any;
  totalResults: any;

  constructor(
    private chargesService: ChargesService,
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
    this.subscribeCharge()
    this.initForm();
  }

  ngOnDestroy(){
    this.chargeSubscription.unsubscribe();
  }

  initForm(){
    this.createChargeFormGroup = this.fb.group(
      {
        name: ['', Validators.compose([Validators.required])],
        // active: [false, Validators.compose([])],
      }
    );
    this.editChargeFormGroup = this.fb.group(
      {
        chargeId: ['', Validators.compose([Validators.required])],
        name: ['', Validators.compose([Validators.required])],
        // active: [false, Validators.compose([])],
      }
    );
  }

  submit(){
    this.createChargeFormError = ''
    if (this.createChargeFormGroup.valid){
      let charge = {
        name: this.createChargeFormGroup.controls.name.value,
        // active: this.createChargeFormGroup.controls.active.value === true,
      };
      this.chargesService.storeCharge({...charge})
        .pipe(shareReplay(), first())
        .subscribe({
          next: (charge: any) => {
            // console.log('NEXT', charge)
            this.modalService.dismissAll();
            this.createChargeFormGroup.reset();
            this.chargesService.getAllCharges(this.page, 'active=true&sortBy=createdAtDateTime:desc');
          },
          error: (err: any) => {
            this.createChargeFormError = err.error.message;
            // console.log('ERROR', err)
          },
          complete: () => {
            // console.log('COMPLETE')
          }
        });
    }
  }

  update(){
    this.editChargeFormError = ''
    if (this.editChargeFormGroup.valid){
      let charge = {
        name: this.editChargeFormGroup.controls.name.value,
        // active: this.editChargeFormGroup.controls.active.value === true,
      };
      this.callUpdateService(this.editChargeFormGroup.controls.chargeId.value, {...charge});
    }
  }

  callUpdateService(id: any, data: any){
    this.chargesService.updateCharge(id, data)
      .pipe(shareReplay(), first())
      .subscribe({
        next: (charge: any) => {
          // console.log('NEXT', charge)
          this.modalService.dismissAll();
          this.editChargeFormGroup.reset();
          this.chargesService.getAllCharges(this.page, 'active=true&sortBy=createdAtDateTime:desc');
        },
        error: (err: any) => {
          this.editChargeFormError = err.error.message;
          // console.log('ERROR', err)
        },
        complete: () => {
          // console.log('COMPLETE')
        }
      });
  }

  subscribeCharge(){
    this.chargeSubscription = this.chargesService.charges$.subscribe((charges: any) => {
      // console.log('charges')
      // console.log(charges)
      this.charges =  charges.results
      this.page = charges.page;
      this.limit = charges.limit;
      this.totalPages = charges.totalPages;
      this.totalPagesArray = Array.from({length:this.totalPages},(v,k)=>k+1);
      this.totalResults = charges.totalResults;
      this.ref.detectChanges();
    });
    this.chargesService.getAllCharges(1, 'active=true&sortBy=createdAtDateTime:desc');
  }

  paginationClicked(pageNum: any){
    // console.log('clicked page num is : ' + pageNum);
    this.page = pageNum;
    this.chargesService.getAllCharges(pageNum, 'active=true&sortBy=createdAtDateTime:desc');
  }

  open(content: any){
    this.modalService.open(content, this.modalOptions).result.then((result) => {
    }, (reason) => {
    });
  }

  deleteCharge(charge: any){
    // console.log(charge)
    let fullChargeName = this.titleCasePipe.transform(charge.name);
    Swal.fire({
      title: 'Are you sure want to delete this charge ' + fullChargeName + ' ?',
      text: 'You will not be able to recover this charge',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete Charge',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#50CD89',
    }).then((result: any) => {
      if (result.value){
        this.callUpdateService(charge.id, {active: false});
        Swal.fire({
          title: 'Deleted!',
          html: 'Your charge ' + fullChargeName + ' has been deleted.',
          icon: 'success',
          confirmButtonColor: '#50CD89'
        })
      } else if (result.dismiss === Swal.DismissReason.cancel){
        Swal.fire({
          title: 'Cancelled',
          html: 'Your charge ' + fullChargeName + ' is safe :)',
          icon: 'error',
          confirmButtonColor: '#50CD89'
        })
      }
    })
  }

  fillChargesEditForm(charge: any){
    this.editChargeFormGroup.patchValue({
      chargeId: charge?.id,
      name: charge?.name,
      // active: charge?.active
    });
  }

}
