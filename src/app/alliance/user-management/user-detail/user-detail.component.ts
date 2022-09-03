import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {shareReplay, Subscription} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {UserManagementService} from "../user-management.service";
import {NgbModal, NgbModalOptions, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
const URL = 'http://localhost:8080/api/upload';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  editUserFormGroup: FormGroup;
  editUserFormError: any;
  private userSubscription: Subscription;
  private routeSub: Subscription;
  userId: any;
  user: any;
  title = 'ng-bootstrap-modal-demo';
  modalOptions:NgbModalOptions;
  ngbModalRef: NgbModalRef;

  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'image',
  });

  constructor(
    private userManagementService: UserManagementService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService
  ){
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      size:'xl'
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribers();
  }

  initForm(){
    this.editUserFormGroup = this.fb.group(
      {
        name: ['', Validators.compose([Validators.required])],
        active: [false, Validators.compose([])],
        email: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([ ])],
        // gender: ['', Validators.compose([Validators.required])],
        role: ['', Validators.compose([Validators.required])]
      }
    );
  }

  update(){
    this.editUserFormError = '';
    if (this.editUserFormGroup.valid){
      let user = {
        name: this.editUserFormGroup.controls.name.value,
        active: this.editUserFormGroup.controls.active.value === true,
        email: this.editUserFormGroup.controls.email.value,
        password: this.editUserFormGroup.controls.password.value,
        // gender: this.editUserFormGroup.controls.gender.value,
        role: this.editUserFormGroup.controls.role.value,
      };
      this.userManagementService.updateUser(this.userId, {...user})
        .pipe(shareReplay(), first())
        .subscribe({
          next: (user: any) => {
            this.editUserFormGroup.reset();
            this.userManagementService.getUser(this.userId);
          },
          error: (err: any) => {
            this.editUserFormError = err.error.message;
          },
          complete: () => {
          }
      });
    }
  }

  subscribers(){
    this.userSubscription = this.userManagementService.user$.subscribe((user: any) => {
      this.user =  user
      this.editUserFormGroup.patchValue({
        name: user?.name,
        email: user?.email,
        active: user?.active,
        role: user?.role,
        // gender: user?.gender,
      });
      this.ref.detectChanges();
      this.modalService.dismissAll();
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.userManagementService.getUser(this.userId);
    });
  }

  ngOnDestroy(){
    this.routeSub.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  open(content: any){
    this.modalService.open(content, this.modalOptions).result.then((result) => {
    }, (reason) => {
    });
  }

}

