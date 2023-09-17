import { Component, Injector, Input, ViewContainerRef, inject } from '@angular/core';
import { ChatReply } from '@app/_models/reply';

@Component({
  selector: 'ticket-panel',
  templateUrl: './ticket-panel.component.html',
  styleUrls: ['./ticket-panel.component.css']
})
export class TicketPanelComponent {
  @Input({required:true}) ticket;
  messages: ChatReply[];
  showTable = false;
  ngOnInit() {
    this.messages = this.ticket.messages;
  }
  toggleTable(): void {
    this.showTable = !this.showTable;
  }
}
