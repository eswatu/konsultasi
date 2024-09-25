import { Component } from '@angular/core';
import { AuthService} from "./auth/auth.service";
import { User } from './_models';

@Component({ selector: 'app-root',
            templateUrl: 'app.component.html'
          })
export class AppComponent {
    user?: User | null;  
    constructor(public authService: AuthService) {
      }
      logout() {
        this.authService.logout(true);
        // console.log('logout')
      }
      ngOnInit() {
        console.log(this.authService.authStatus$)
    }
}