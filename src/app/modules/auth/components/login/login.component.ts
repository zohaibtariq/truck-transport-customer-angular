import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, isObservable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  defaultAuth: any = {
    "email": "",
    "password": ""
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;
    this.authService.updateIsLoadingSubject(true);
    const loginSubscriber = this.authService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: (user: any | undefined) => {
          // console.log('LOGIN : RESPONSE');
          // console.log(user);
          if (!isObservable(user)) {
            this.hasError = false;
            // console.log('Route Navigation/Redirection is blocked...')
            this.router.navigate([this.returnUrl]);
          } else {
            this.hasError = true;
          }
          this.authService.updateIsLoadingSubject(false);
          // console.log('LOGIN : HAS ERROR');
          // console.log(this.hasError);
        },
        error: (err: any) => {
          this.authService.updateIsLoadingSubject(false);
          console.error('LOGIN : ERROR RESPONSE');
          console.error(err);
        },
        complete: () => {
          this.authService.updateIsLoadingSubject(false);
          // console.log('LOGIN : COMPLETE')
        }
      });
    this.unsubscribe.push(loginSubscriber);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
