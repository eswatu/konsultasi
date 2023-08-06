import { Component, Inject, InjectionToken, Input, SimpleChanges } from '@angular/core';
import { Reply } from '@app/_models/reply';
import { AuthenticationService, ReplyService } from '@app/_services';

export const ticketId = new InjectionToken<string>('ticketId');

@Component({
  selector: 'reply-table',
  templateUrl: './reply-table.component.html',
  styleUrls: ['./reply-table.component.css']
})
export class ReplyTableComponent {
  displayedColumns = ['id', 'createdAt', 'message'];
   user: any;

  replies: Reply[] = [];

  showForm = false;
  //create input reply
  reply = '';
  newReply() {
    this.showForm = !this.showForm;
  }
  @Input() solved;
  @Input({required:true}) ticketId;

  constructor(@Inject('ticketId')private tktid: string,
    private rplService:ReplyService,
    private authService: AuthenticationService) {
      this.user = this.authService.user.subscribe(x => this.user = x);
    };
    
    ngOnInit() {
      this.ticketId = this.tktid;
      try {
    this.getData(this.ticketId);
  } catch (error) {
    console.error(error);
  }
  console.log(this.ticketId);
}

async getData(tkt: string) {
  try {
    this.replies = await this.rplService.getData(tkt).toPromise();
  } catch (error) {
    // handle error in a user-friendly way
    alert('Error loading replies. Please try again later.');
  }
}
}
