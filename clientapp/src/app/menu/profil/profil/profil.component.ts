import { Component,  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services/';
// import { MustMatch } from '@env/services/mustmatch';
import Swal from 'sweetalert2';
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
    private fb: FormBuilder) {
      this.authService.user.subscribe(x => {
        this.userInfo = x;
        this.isDisabled = x.role !== 'Admin';
        console.log(this.isDisabled);
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
}
