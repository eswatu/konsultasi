import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService, UserService } from '@app/_services';

@Component({
  selector: 'app-user-pw-form',
  templateUrl: './user-pw-form.component.html',
  styleUrls: ['./user-pw-form.component.css']
})
export class UserPwFormComponent {
  passwordForm: FormGroup;
  iduser: string;
  isAdmin: boolean;
  constructor(private authService: AuthenticationService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UserPwFormComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) data) {
      this.iduser = data.id;
      this.authService.user.subscribe(x => {
        this.isAdmin = x.role === 'Admin';
      });   
  }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      oldpw: ['', Validators.required],
      newpw1: ['', [Validators.required, Validators.minLength(6)]],
      newpw2: ['', [Validators.required, Validators.minLength(6)]]
    },{validators: this.matchValues('newpw1', 'newpw2')});
    if (this.isAdmin) {
      this.passwordForm.patchValue({oldpw:'xxxxxxxx'});
    }
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const pwform = {'id': this.iduser,
                      'oldpassword': this.passwordForm.get('oldpw').value,
                        'newpassword': this.passwordForm.get('newpw1').value};
      this.userService.pwput(pwform).subscribe(res => {
        this.snackBar.open(res.body['message'], '',{duration: 2500});
        this.closeDialog();
      },
      error => {
        this.snackBar.open('Error: '+ error, '',{duration: 2500});
      })
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
  // buat tambahan
  matchValues(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
  
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ matchValues: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
