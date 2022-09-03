import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;
    this.authService.updateIsLoadingSubject(true);
    // return false;
    const forgotPasswordSubscriber = this.authService
      .forgotPassword(this.f.email.value)
      .pipe(first())
      // .subscribe((result: any) => {
      //   console.log('result')
      //   console.log(result)
      //   // this.errorState = false ? ErrorStates.NoError : ErrorStates.HasError;
      // });
      .subscribe({
        next: (result: any) => {
          this.errorState = ErrorStates.NoError;
          this.authService.updateIsLoadingSubject(false);
          console.log('forgotPasswordSubscriber : RESULT')
          console.log(result)
        },
        error: (err: any) => {
          this.authService.updateIsLoadingSubject(false);
          this.errorState = ErrorStates.HasError;
          console.log('forgotPasswordSubscriber : ERROR')
          console.log(err)
        },
        complete: () => {
          this.authService.updateIsLoadingSubject(false);
          console.log('COMPLETE')
        }
      })
    this.unsubscribe.push(forgotPasswordSubscriber);
  }
}
