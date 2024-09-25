import { Component } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { Role } from "@app/auth/auth.enum";
@Component({
  selector: 'app-profil-tab',
  templateUrl: './profil-tab.component.html',
  styleUrls: ['./profil-tab.component.css']
})
export class ProfilTabComponent {
  isAdmin: boolean;
  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(x => {
      this.isAdmin = x.role === Role.Admin;
    })
  }

}
