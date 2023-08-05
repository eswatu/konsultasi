import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

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

// Explanation:
// - Added import statements for necessary Angular modules and classes.
// - Added type hints for class properties and method return types.
// - Moved the creation of the login form to a separate method for better readability and maintainability.
// - Renamed the `ErrorMessageUsername` and `ErrorMessagePassword` methods to `getErrorMessage` to make it more generic and reusable.
// - Updated the `getErrorMessage` method to accept the control name as a parameter and return the appropriate error message based on the control's state.
// - Removed unnecessary type casting in the `getErrorMessage` method.
// - Removed the `pipe(first())` operator as it is not necessary for the current implementation.
// - Extracted the username and password values from the form controls directly in the `onSubmit` method for better readability.
// - Updated the `subscribe` method to handle the success and error cases separately.
// - Removed the unnecessary check for `this.authenticationService.userValue` in the constructor as it is not used in the current implementation.