import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { Role } from '@app/auth/auth.enum';

@Component({
  selector: 'ticket-tab',
  templateUrl: './ticket-tab.component.html',
  styleUrls: ['./ticket-tab.component.css']
})
export class TicketTabComponent implements OnInit {
  isAdmin : boolean
  constructor(private authService: AuthService) {
    this.isAdmin = authService.currentUser$.value.role === Role.Admin ? true : false
  }

  ngOnInit(): void {
  }

}
