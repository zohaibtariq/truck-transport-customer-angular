import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {shareReplay, Subscription} from "rxjs";
import {ChangeDetectorRef} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from 'sweetalert2';
import {TitleCasePipe} from '@angular/common';
import {GoodsService} from "./goods.service";

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.scss']
})
export class GoodsComponent implements OnInit {

  createGoodFormGroup: FormGroup;
  editGoodFormGroup: FormGroup;
  createGoodFormError: any;
  editGoodFormError: any;
  goods: any[];
  private goodSubscription: Subscription;
  title = 'ng-bootstrap-modal-demo';
  modalOptions:NgbModalOptions;
  page: any = 1;
  limit: any;
  totalPages: any;
  totalPagesArray: any;
  totalResults: any;

  constructor(
    private goodsService: GoodsService,
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
    this.subscribeGood()
    this.initForm();
  }

  ngOnDestroy(){
    this.goodSubscription.unsubscribe();
  }

  initForm(){
    this.createGoodFormGroup = this.fb.group(
      {
        name: ['', Validators.compose([Validators.required])],
        // active: [false, Validators.compose([])],
      }
    );
    this.editGoodFormGroup = this.fb.group(
      {
        goodId: ['', Validators.compose([Validators.required])],
        name: ['', Validators.compose([Validators.required])],
        // active: [false, Validators.compose([])],
      }
    );
  }

  submit(){
    this.createGoodFormError = ''
    if (this.createGoodFormGroup.valid){
      let good = {
        name: this.createGoodFormGroup.controls.name.value,
        // active: this.createGoodFormGroup.controls.active.value === true,
      };
      this.goodsService.storeGood({...good})
        .pipe(shareReplay(), first())
        .subscribe({
          next: (good: any) => {
            // console.log('NEXT', good)
            this.modalService.dismissAll();
            this.createGoodFormGroup.reset();
            this.goodsService.getAllGoods(this.page, 'active=true&sortBy=createdAtDateTime:desc');
          },
          error: (err: any) => {
            this.createGoodFormError = err.error.message;
            // console.log('ERROR', err)
          },
          complete: () => {
            // console.log('COMPLETE')
          }
        });
    }
  }

  update(){
    this.editGoodFormError = ''
    if (this.editGoodFormGroup.valid){
      let good = {
        name: this.editGoodFormGroup.controls.name.value,
        // active: this.editGoodFormGroup.controls.active.value === true,
      };
      this.callUpdateService(this.editGoodFormGroup.controls.goodId.value, {...good});
    }
  }

  callUpdateService(id: any, data: any){
    this.goodsService.updateGood(id, data)
      .pipe(shareReplay(), first())
      .subscribe({
        next: (good: any) => {
          // console.log('NEXT', good)
          this.modalService.dismissAll();
          this.editGoodFormGroup.reset();
          this.goodsService.getAllGoods(this.page, 'active=true&sortBy=createdAtDateTime:desc');
        },
        error: (err: any) => {
          this.editGoodFormError = err.error.message;
          // console.log('ERROR', err)
        },
        complete: () => {
          // console.log('COMPLETE')
        }
      });
  }

  subscribeGood(){
    this.goodSubscription = this.goodsService.goods$.subscribe((goods: any) => {
      // console.log('goods')
      // console.log(goods)
      this.goods =  goods.results
      this.page = goods.page;
      this.limit = goods.limit;
      this.totalPages = goods.totalPages;
      this.totalPagesArray = Array.from({length:this.totalPages},(v,k)=>k+1);
      this.totalResults = goods.totalResults;
      this.ref.detectChanges();
    });
    this.goodsService.getAllGoods(1, 'active=true&sortBy=createdAtDateTime:desc');
  }

  paginationClicked(pageNum: any){
    // console.log('clicked page num is : ' + pageNum);
    this.page = pageNum;
    this.goodsService.getAllGoods(pageNum, 'active=true&sortBy=createdAtDateTime:desc');
  }

  open(content: any){
    this.modalService.open(content, this.modalOptions).result.then((result) => {
    }, (reason) => {
    });
  }

  deleteGood(good: any){
    // console.log(good)
    let fullGoodName = this.titleCasePipe.transform(good.name);
    Swal.fire({
      title: 'Are you sure want to delete this good ' + fullGoodName + ' ?',
      text: 'You will not be able to recover this good',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete Good',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#50CD89',
    }).then((result: any) => {
      if (result.value){
        this.callUpdateService(good.id, {active: false});
        Swal.fire({
          title: 'Deleted!',
          html: 'Your good ' + fullGoodName + ' has been deleted.',
          icon: 'success',
          confirmButtonColor: '#50CD89'
        })
      } else if (result.dismiss === Swal.DismissReason.cancel){
        Swal.fire({
          title: 'Cancelled',
          html: 'Your good ' + fullGoodName + ' is safe :)',
          icon: 'error',
          confirmButtonColor: '#50CD89'
        })
      }
    })
  }

  fillGoodsEditForm(good: any){
    this.editGoodFormGroup.patchValue({
      goodId: good?.id,
      name: good?.name,
      // active: good?.active
    });
  }

}
