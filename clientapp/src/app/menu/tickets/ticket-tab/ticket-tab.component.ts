import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'ticket-tab',
  templateUrl: './ticket-tab.component.html',
  styleUrls: ['./ticket-tab.component.css']
})
export class TicketTabComponent implements OnInit, OnDestroy {
  isUser: boolean;
  user: any;
  private userSubscription: Subscription;

  constructor(private authSrvc: AuthenticationService) {}

  ngOnInit(): void {
    this.userSubscription = this.authSrvc.user.subscribe(x => {
      this.user = x;
      if (this.user) {
        this.isUser = this.user.role === 'Client';
      }
    });
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
