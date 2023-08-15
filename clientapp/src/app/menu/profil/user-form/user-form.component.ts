import { Component, Inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '@app/_models';
import { UserService } from '@app/_services';
import Swal from 'sweetalert2';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  userForm: FormGroup;
  user: User;
  iduser;
  constructor(private userService: UserService,private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      if (data) {
        this.iduser = data.id;
      }
    }
    ngOninit():void {
      if (this.iduser) {
        this.userService.get(this.iduser).subscribe(value => {
          this.user = value;
        },
        error => error.error);
      }
    }
    onSubmit() {
      if (this.userForm.valid) {
        this.user = this.userForm.value;
        this.userService.post<User>(this.user).subscribe(respon => {
          Swal.fire(JSON.stringify(respon));
          this.closeDialog();
        }, error => {
          console.error(error);
          Swal.fire(error.error.message);
        })
      }
    }
  closeDialog() {
    this.dialogRef.close();
  }
}
