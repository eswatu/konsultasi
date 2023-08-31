import { Component, Inject } from '@angular/core';
import { AbstractControl, Form, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@app/_models';
import { UserService } from '@app/_services';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  private successtime = 2000;
  private failtime = 5500;
  userForm: FormGroup;
  user: User;
  iduser;
  options:{ key: string, value: string }[]  = [
    { key:'Administrator', value: 'Admin'},
    { key:'Pekerja Kantor', value: 'Worker'},
    { key:'Pengguna Biasa', value: 'Client'}
  ];

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      if (data) {
        this.iduser = data.id;

      }
    }
    ngOnInit() {
      this.userForm = this.fb.group({
        username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.]*$'), Validators.maxLength(20),Validators.pattern('^[^\\s]+$')]],
        password: ['', [this.passwordValidator(!this.iduser), Validators.pattern('^[a-zA-Z0-9.]*$'), Validators.maxLength(20), Validators.pattern('^[^\\s]+$')]],
        name: ['', Validators.required],
        company: ['', Validators.required],
        role: ['', Validators.required],
        contact: ['', Validators.required],
        isActive: [true]
      });
      

      if (this.iduser) {
        this.userForm.get('password').clearValidators();
        this.userForm.get('password').updateValueAndValidity();
        this.userService.get(this.iduser).subscribe(value => {
          this.user = value;
          this.userForm.patchValue(value);
        },
        error => error.error);
      }
    }

    passwordValidator(required: boolean): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
        if (required && Validators.required(control)) {
          return { required: true };
        }
        return null;
      };
    }
    onSubmit() {
      if (this.userForm.valid) {
        const newUser: User = {
          username: this.userForm.value.username,
          password: this.userForm.value?.password,
          name: this.userForm.value.name,
          company: this.userForm.value.company,
          role: this.userForm.value.role,
          contact: this.userForm.value.contact,
          isActive: this.userForm.value.isActive
        };
        if (this.iduser) {
          newUser.id = this.iduser;
          this.userService.put(newUser).subscribe(
            response => {
              console.log(response);
              this.snackBar.open(response.body['message'],'', {duration:this.successtime});
              this.closeDialog();
            }, error => {
              console.error(error);
              this.snackBar.open(`Error: ${error}`,'' ,{duration:this.failtime});
            }
          )

        }else {
          this.userService.post(newUser).subscribe(
            response => {
              console.log(response);
              this.snackBar.open(response.body['message'],'', {duration:this.successtime});
              this.closeDialog();
            }, error => {
              console.error(error);
              this.snackBar.open(`Error: ${error}`,'' ,{duration:this.failtime});
            });

        }
      }
    }
    
  closeDialog() {
    this.dialogRef.close();
  }
}
