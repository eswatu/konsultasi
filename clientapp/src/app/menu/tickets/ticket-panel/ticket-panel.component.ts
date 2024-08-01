import { Component, Injector, Input, ViewContainerRef, inject } from '@angular/core';
import { MessageDocument } from '@app/_models/message';

@Component({
  selector: 'ticket-panel',
  templateUrl: './ticket-panel.component.html',
  styleUrls: ['./ticket-panel.component.css']
})
export class TicketPanelComponent {
  @Input({required:true}) ticket;
  messages: MessageDocument[];
  showTable = false;
  ngOnInit() {
    this.messages = this.ticket.messages;
  }
  toggleTable(): void {
    this.showTable = !this.showTable;
  }
}
