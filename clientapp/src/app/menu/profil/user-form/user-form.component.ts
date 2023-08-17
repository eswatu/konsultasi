import { HttpResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
        password: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.]*$'), Validators.maxLength(20), Validators.pattern('^[^\\s]+$')]],
        name: ['', Validators.required],
        company: ['', Validators.required],
        role: ['', Validators.required],
        contact: ['', Validators.required],
        isActive: [true]
      });
      

      if (this.iduser) {
        this.userService.get(this.iduser).subscribe(value => {
          this.user = value;
        },
        error => error.error);
      }
    }
    onSubmit() {
      if (this.userForm.valid) {
        const newUser: User = {
          username: this.userForm.value.username,
          password: this.userForm.value.password,
          name: this.userForm.value.name,
          company: this.userForm.value.company,
          role: this.userForm.value.role,
          contact: this.userForm.value.contact,
          isActive: this.userForm.value.isActive
        };
    
        this.userService.post(newUser).subscribe(
          response => {
            console.log(response);
            this.snackBar.open(response.body['message'],'', {duration:5000});
            this.closeDialog();
          },
          error => {
            console.error(error);
            this.snackBar.open(`Error: ${error}`,'' ,{duration:1500});
          }
        );
      }
    }
    
  closeDialog() {
    this.dialogRef.close();
  }
}
