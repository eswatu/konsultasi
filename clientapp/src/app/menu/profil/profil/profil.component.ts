import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services/';
// import { MustMatch } from '@env/services/mustmatch';
import { UserService } from '@app/_services/';
import { Observable, ReplaySubject } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent {

  userId;
  userInfo: User;
  form : FormGroup;
  
  constructor(private userService: UserService,
    private authService: AuthenticationService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder) {
      this.authService.user.subscribe(x => {
        this.userInfo = x;
        this.userId = x.id;
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
