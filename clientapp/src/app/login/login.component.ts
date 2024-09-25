import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@app/auth/auth.service';
import { SubSink } from 'subsink';
import { catchError, combineLatest, filter, tap } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private subs = new SubSink()
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  redirectUrl: string
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    route: ActivatedRoute,
    private router: Router,
    // private authenticationService: AuthenticationService
  ) {
    this.subs.sink = route.paramMap.subscribe(
      (params) => (this.redirectUrl = params.get('redirectUrl') ?? '')
    )
  }

  ngOnInit() {
    this.authService.logout
    this.createLoginForm();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async login(submittedForm: FormGroup) {
    this.authService
    .login(submittedForm.value.username, submittedForm.value.password)
    .pipe(catchError((err) => (this.error = err)))

    this.subs.sink = combineLatest([
      this.authService.authStatus$,
      this.authService.currentUser$
    ])
    .pipe(
      filter(([authStatus, user]) => authStatus.isAuthenticated && user?._id !== ''),
      tap(([authStatus, user]) => {
        this.router.navigate([this.redirectUrl])
      })
    )
    .subscribe()
  }

  getErrorMessage(controlName: string): string {
    const control: FormControl = this.loginForm.get(controlName) as FormControl;
    if (control.untouched) {
      return controlName;
    } else if (control.hasError('required')) {
      return `${controlName} tidak boleh kosong`;
    } else {
      return '';
    }
  }
  get f() {
    return this.loginForm.controls;
  }
}
