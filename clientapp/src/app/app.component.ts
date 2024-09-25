import { Component } from '@angular/core';
import { AuthService} from "./auth/auth.service";

@Component({ selector: 'app-root',
            templateUrl: 'app.component.html'
          })
export class AppComponent {
  constructor(public authService: AuthService) {
  }
    logout() {
      this.authService.logout(true);
      // console.log('logout')
    }
    ngOnInit() {
      console.log(this.authService.authStatus$.value.isAuthenticated)
  }
}