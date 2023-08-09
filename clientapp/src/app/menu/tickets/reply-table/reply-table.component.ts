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
  showInput = false;
  showForm = false;
  //create input reply
  reply :Reply = { id: null, createdAt: null, message: null, isKey: false };
  newReply() {
    this.showForm = !this.showForm;
  }

  addRow() {
    this.rplService.post<Reply>(this.reply, this.ticketId).subscribe(data => {
      this.replies.push(data);
    })
    this.showInput = false;
  }
  @Input({required:true}) ticketId;

  constructor(private rplService:ReplyService,
    private authService: AuthenticationService) {
      this.user = this.authService.user.subscribe(x => this.user = x);
    };
    
    ngOnInit() {
      try {
      this.getData(this.ticketId);
    } catch (error) {
      console.error(error);
    }
  console.log(this.ticketId);
}

getData(tkt: string) {
  try {
    this.rplService.getData(tkt).subscribe(data => this.replies = data);
  } catch (error) {
    // handle error in a user-friendly way
    alert('Error loading replies. Please try again later.');
  }
}
}
