import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-user-pw-form',
  templateUrl: './user-pw-form.component.html',
  styleUrls: ['./user-pw-form.component.css']
})
export class UserPwFormComponent {
  passwordForm: FormGroup;
  iduser: string;
  isAdmin: boolean;
  constructor(private authService: AuthenticationService ,private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) data) {
      this.iduser = data.id;
      this.authService.user.subscribe(x => {
        this.isAdmin = x.role === 'Admin';
      });   
  }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      oldpw1: ['', Validators.required],
      oldpw2: ['', Validators.required],
      newpw: ['', Validators.required]
    });
    if (this.isAdmin) {
      this.passwordForm.patchValue({oldpw1:'xxxxxxxx', oldpw2:'xxxxxxxx'});
    }
  }

  onSubmit() {

  }
  closeDialog() {
    
  }
}
