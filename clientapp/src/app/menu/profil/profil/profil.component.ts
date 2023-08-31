import { Component,  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services/';
// import { MustMatch } from '@env/services/mustmatch';
import { UserPwFormComponent } from '../user-pw-form/user-pw-form.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Component({
  selector: 'profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent {
  userInfo: User;
  form : FormGroup;
  isDisabled: boolean;
  
  constructor(private authService: AuthenticationService,
    private fb: FormBuilder, public dialog: MatDialog) {
      this.authService.user.subscribe(x => {
        this.userInfo = x;
        this.isDisabled = x.role !== 'Admin';
      });
    }

  ngOnInit(){
    //untuk form tampilan
    this.form = this.fb.group({
      username: [''],
      name    : [''],
      company   : [''],
      role    : [''],
      contact: ['']
    });
    this.form.patchValue(this.userInfo);
  }
  changePw() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.restoreFocus = true;
    dialogConfig.minWidth = 500;
    dialogConfig.minHeight = 250;
    dialogConfig.maxHeight = 400;
    dialogConfig.data = { id: this.userInfo.id };
   this.dialog.open(UserPwFormComponent, dialogConfig);
  }
}
