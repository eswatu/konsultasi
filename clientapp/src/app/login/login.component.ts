import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '@app/_services';
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const username = this.f.username.value;
    const password = this.f.password.value;

    this.authenticationService.login(username, password)
      .subscribe(
        () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );
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
}
