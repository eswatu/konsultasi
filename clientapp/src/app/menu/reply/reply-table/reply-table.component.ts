import { Component, Input } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Reply } from '@app/_models/reply';
import { Ticket } from '@app/_models/ticket';
import { AuthenticationService, ReplyService } from '@app/_services';

@Component({
  selector: 'reply-table',
  templateUrl: './reply-table.component.html',
  styleUrls: ['./reply-table.component.css']
})
export class ReplyTableComponent {
  displayedColumns = ['id', 'createdAt', 'message'];
  user;
  replies: Reply[] = [];
  showForm = false;
  newReply() {
    this.showForm = !this.showForm;
  }
  @Input() solved;
  @Input() ticketId;
  constructor(private rplService:ReplyService,
    private authService: AuthenticationService) {
      this.user = this.authService.user.subscribe(x => this.user = x);
    };

    ngOnInit(): void {
      this.loadData();
    }
    loadData() {
      this.getData(this.ticketId);
    }
    getData(ticketId: string) {
          //use service
      this.rplService.getData(ticketId).subscribe(result => {
          this.replies = result;
        }, error => console.error(error));
    }
    //test ai
}
