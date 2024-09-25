import { Component,  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '@app/_models';
import { AuthService } from '@app/auth/auth.service';
import { Role } from "@app/auth/auth.enum";
// import { MustMatch } from '@env/services/mustmatch';
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
  
  constructor(private authService: AuthService,
    private fb: FormBuilder, public dialog: MatDialog) {
      this.authService.currentUser$.subscribe(x => {
        this.userInfo = x as User;
        this.isDisabled = x.role !== Role.Admin;
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
    dialogConfig.data = { id: this.userInfo._id };
  }
}
