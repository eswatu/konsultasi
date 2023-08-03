import { Component } from '@angular/core';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'ticket-tab',
  templateUrl: './ticket-tab.component.html',
  styleUrls: ['./ticket-tab.component.css']
})
export class TicketTabComponent {
  isAdmin;
  user;
  constructor(private authSrvc: AuthenticationService) {
    this.authSrvc.user.subscribe(x => this.user = x);
    if (this.user) {
        this.isAdmin = this.user.role === 'Admin';
    } 
  }

  ngOnInit(): void {
  }

}
