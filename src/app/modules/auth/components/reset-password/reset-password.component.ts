import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { passwordMatchValidator } from "../../providers/CustomValidators";
import { ActivatedRoute, Router } from '@angular/router';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  token: string | null;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetPasswordForm.controls;
  }

  initForm() {
    this.resetPasswordForm = this.fb.group({
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ]),
      ],
      confirmPassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ]),
      ],
    },
      {
        validator: passwordMatchValidator
      }
    );
  }

  submit() {
    this.authService.updateIsLoadingSubject(true);
    this.errorState = ErrorStates.NotSubmitted;
    this.authService.updateIsLoadingSubject(true);
    const resetPasswordSubscriber = this.authService
      .resetPassword({
        'password': this.f.password.value,
        'token': this.token
      })
      .pipe(first())
      .subscribe({
        next: (result: any) => {
          this.errorState = ErrorStates.NoError;
          this.authService.updateIsLoadingSubject(false);
          // console.log('resetPasswordSubscriber : RESULT')
          // console.log(result)
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 1500)
        },
        error: (err: any) => {
          this.authService.updateIsLoadingSubject(false);
          this.errorState = ErrorStates.HasError;
          // console.log('resetPasswordSubscriber : ERROR')
          // console.log(err)
        },
        complete: () => {
          this.authService.updateIsLoadingSubject(false);
          // console.log('resetPasswordSubscriber : COMPLETE')
        }
      })
    this.unsubscribe.push(resetPasswordSubscriber);
  }
}
