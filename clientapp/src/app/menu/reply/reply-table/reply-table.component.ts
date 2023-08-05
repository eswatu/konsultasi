import { Component, Input } from '@angular/core';
import { Reply } from '@app/_models/reply';
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
      this.rplService.getData(this.ticketId).subscribe(result => {
        this.replies = result;
      }, error => console.error(error));
    }

    getData(ticketId: string) {
      this.rplService.getData(ticketId).subscribe(result => {
        this.replies = result;
      }, error => {
        // handle error in a user-friendly way
        alert('Error loading replies. Please try again later.');
      });
    }
}
