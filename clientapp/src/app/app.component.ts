import { Component } from '@angular/core';

import { AuthenticationService } from './_services';
import { User } from './_models';

@Component({ selector: 'app-root',
            templateUrl: 'app.component.html'
          })
export class AppComponent {
    user?: User | null;
    loading = false;
    title = 'Konsultasi';
    
    constructor(private authenticationService: AuthenticationService) {
        this.authenticationService.user.subscribe(x => this.user = x);
    }
    get isAuthorized() {
      return this.user;
    }
  
    logout() {
        this.authenticationService.logout();
    }
    ngOnInit() {
      this.loading = true;
      console.log(this.user);
    }
}