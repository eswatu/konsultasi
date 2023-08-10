import { Component } from '@angular/core';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-profil-tab',
  templateUrl: './profil-tab.component.html',
  styleUrls: ['./profil-tab.component.css']
})
export class ProfilTabComponent {
  isAdmin: boolean;
  constructor(private authService: AuthenticationService) {
    this.authService.user.subscribe(x => {
      this.isAdmin = x.role === 'Admin';
    })
  }

}
