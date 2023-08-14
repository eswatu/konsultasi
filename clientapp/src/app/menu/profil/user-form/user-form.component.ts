import { Component, Inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '@app/_models';
import { UserService } from '@app/_services';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  userForm: FormGroup;
  user: User;
  iduser;
  constructor(private userService: UserService,private dialogREf: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      if (data) {
        this.iduser = data.id;
      }
    }
  closeDialog() {
    
  }
}
