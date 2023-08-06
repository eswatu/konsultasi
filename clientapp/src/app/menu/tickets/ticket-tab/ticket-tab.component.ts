import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'ticket-tab',
  templateUrl: './ticket-tab.component.html',
  styleUrls: ['./ticket-tab.component.css']
})
export class TicketTabComponent implements OnInit, OnDestroy {
  isAdmin: boolean;
  user: any;
  private userSubscription: Subscription;

  constructor(private authSrvc: AuthenticationService) {}

  ngOnInit(): void {
    this.userSubscription = this.authSrvc.user.subscribe(x => {
      this.user = x;
      if (this.user) {
        this.isAdmin = this.user.role === 'Admin';
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  private setIsAdmin(value: boolean) {
    this.isAdmin = value;
  }
}
