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


  isEditing:boolean = false;
  toggleButtonValue! : string; 
  userId;
  userInfo: User;
  form : FormGroup;
  // formPwd: FormGroup;
  // formAvatar: FormControl;
  // pictureImage;
  // urlImage;
  
  //ava upload
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  formAvatar: FormControl<any>;
  
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
    
    this.formAvatar = new FormControl();
    //untuk form tampilan
    this.form = this.fb.group({
      username: [''],
      name    : [''],
      level   : [''],
      role    : [''],
      baseAngkre: ['']
    });
    //untuk password
    // this.formPwd = this.fb.group({
    //   oldpwd  : ['', Validators.required],
    //   newPwd  : ['',Validators.required],
    //   renewPwd: ['', Validators.required]
    // },
    // { validator : MustMatch('newPwd', 'renewPwd')});
    this.form.patchValue(this.userInfo);
    //load data
    // this.loadData();
    this.toggleButtonValue = 'Edit Mode';
  }

  // loadData(){
  //     if (this.userInfo.AvatarId){
  //       this.userService.downImage(this.userInfo.AvatarId)
  //       .subscribe((img) => {
  //         var blob = new Blob([img], {type:'image/jpeg'});
  //         var urlimage = URL.createObjectURL(blob);
  //         console.log(urlimage);
  //         // this.pictureImage = this.sanitizer.bypassSecurityTrustResourceUrl(urlimage);
  //       }, err => console.log(err));
  //   }
  //     // this.form.patchValue({level: this.jenjang});
  // }

  // toggleEdit(){
  //   this.isEditing = !this.isEditing;
  //   this.toggleButtonValue = this.isEditing ? 'Stop Edit' : 'Edit Mode';
  // }
  // selectFile(event: any): void {
  //   this.selectedFiles = event.target.files;
  // }
  // upload() {
  //   this.progress = 0;
  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  //     if (file) {
  //       this.currentFile = file;
  //       this.userService.uploadAva(this.currentFile, this.userId).subscribe({
  //         next: (event: any) => {
  //           if (event.type === HttpEventType.UploadProgress) {
  //             this.progress = Math.round(100 * event.loaded / event.total);
  //           } else if (event instanceof HttpResponse) {
  //             this.message = event.body.message;
  //           }
  //         },
  //         error: (err: any) => {
  //           console.log(err);
  //           this.progress = 0;
  //           if (err.error && err.error.message) {
  //             this.message = err.error.message;
  //           } else {
  //             this.message = 'Could not upload the file!';
  //           }
  //           this.currentFile = undefined;
  //         }
  //       });
  //     }
  //     this.selectedFiles = undefined;
  //     this.ngOnInit();
  //   }
  // }
  // changePassword() {
  //   let npwd = <chpwd>{
  //     id: this.userId,
  //     oldpwd: this.formPwd.get('oldpwd').value,
  //     newpwd: this.formPwd.get('newPwd').value
  //   };
  //   console.log(npwd);
  //   this.userService.changePwd(npwd).subscribe( result => {
  //     console.log(result);
  //     Swal.fire(result);
  //   }, error => console.error(error));
    
  // }

}