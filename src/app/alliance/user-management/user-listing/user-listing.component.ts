import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {first} from "rxjs/operators";
import {shareReplay, Subscription} from "rxjs";
import {ChangeDetectorRef} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserManagementService} from "./../user-management.service";
import Swal from 'sweetalert2';
import {TitleCasePipe} from '@angular/common';
import { CSVRecord } from './../user-import/CSVModel';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss']
})
export class UserListingComponent implements OnInit {

  createUserFormGroup: FormGroup;
  createUserFormError: any;
  heading = 'Users';
  users: any[];
  private userSubscription: Subscription;
  title = 'ng-bootstrap-modal-demo';
  modalOptions:NgbModalOptions;
  page: any = 1;
  limit: any;
  totalPages: any;
  totalPagesArray: any;
  totalResults: any;

  constructor(
    private userManagementService: UserManagementService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private titleCasePipe: TitleCasePipe,
  ){
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      size:'xl'
    }
  }

  ngOnInit(): void {
    this.subscribeUser()
    this.initForm();
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }

  initForm(){
    this.createUserFormGroup = this.fb.group(
      {
        name: ['', Validators.compose([Validators.required])],
        active: [false, Validators.compose([])],
        email: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([Validators.required])],
        // gender: ['', Validators.compose([Validators.required])],
        role: ['', Validators.compose([Validators.required])]
      }
    );
  }

  submit(){
    this.createUserFormError = ''
    if (this.createUserFormGroup.valid){
      let user = {
        name: this.createUserFormGroup.controls.name.value,
        active: this.createUserFormGroup.controls.active.value === true,
        email: this.createUserFormGroup.controls.email.value,
        password: this.createUserFormGroup.controls.password.value,
        // gender: this.createUserFormGroup.controls.gender.value,
        role: this.createUserFormGroup.controls.role.value,
      };
      this.userManagementService.storeUser({...user})
        .pipe(shareReplay(), first())
        .subscribe({
          next: (user: any) => {
            // console.log('NEXT', user)
              this.modalService.dismissAll();
              this.createUserFormGroup.reset();
              this.userManagementService.getAllUsers(this.page, 'sortBy=createdAt:desc');
          },
          error: (err: any) => {
            this.createUserFormError = err.error.message;
            console.error('ERROR', err)
          },
          complete: () => {
            // console.log('COMPLETE')
          }
        });
    }
  }

  subscribeUser(){
    this.userSubscription = this.userManagementService.users$.subscribe((users: any) => {
      // console.log('users')
      // console.log(users)
      this.users =  users.results
      this.page = users.page;
      this.limit = users.limit;
      this.totalPages = users.totalPages;
      this.totalPagesArray = Array.from({length:this.totalPages},(v,k)=>k+1);
      this.totalResults = users.totalResults;
      this.ref.detectChanges();
    });
    this.userManagementService.getAllUsers(1, 'sortBy=createdAt:desc');
  }

  paginationClicked(pageNum: any){
    // console.log('clicked page num is : ' + pageNum);
    this.page = pageNum;
    this.userManagementService.getAllUsers(pageNum, 'sortBy=createdAt:desc');
  }

  open(content: any){
    this.modalService.open(content, this.modalOptions).result.then((result) => {
    }, (reason) => {
    });
  }

  filterSubmit(queryString: any){
    // console.log('User : filterSubmit');
    // console.log(queryString);
    // queryString = queryString.replaceAll('location_', '');
    // console.log(queryString);
    this.userManagementService.getAllUsers(1, queryString+((queryString!==''&&queryString!==undefined)?'&':'')+'sortBy=createdAt:desc');
  }

  resetFilter(){
    this.userManagementService.getAllUsers(1, 'sortBy=createdAt:desc');
  }

  deleteUser(user: any){
    // console.log(user)
    let fullUserName = this.titleCasePipe.transform(user.name);
    Swal.fire({
      title: 'Are you sure want to delete this user ' + fullUserName + ' ?',
      text: 'You will not be able to recover this user',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete User',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#50CD89',
    }).then((result: any) => {
      if (result.value){
        this.userManagementService.deleteUser(user.id).pipe(shareReplay(), first())
          .subscribe((user: any) => {
            this.userManagementService.getAllUsers(this.page, 'sortBy=createdAt:desc');
          });
        Swal.fire({
          title: 'Deleted!',
          html: 'Your user ' + fullUserName + ' has been deleted.',
          icon: 'success',
          confirmButtonColor: '#50CD89'
        })
      } else if (result.dismiss === Swal.DismissReason.cancel){
        Swal.fire({
          title: 'Cancelled',
          html: 'Your user ' + fullUserName + ' is safe :)',
          icon: 'error',
          confirmButtonColor: '#50CD89'
        })
      }
    })
  }

  export(){
    this.userManagementService.exportUsers();
  }

}
