import { Component, Injector, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ReplyTableComponent } from '@app/menu/reply/reply-table/reply-table.component';

@Component({
  selector: 'ticket-panel',
  templateUrl: './ticket-panel.component.html',
  styleUrls: ['./ticket-panel.component.css']
})
export class TicketPanelComponent {
  @Input({required:true}) ticket;
  // @ViewChild('childComponent',{read: ViewContainerRef}) container: ViewContainerRef;
  showTable = false;
  replyTableComponent = ReplyTableComponent;
  lazyLoadInjector: Injector;

  constructor(){}

  ngOnInit() {
  }

  toggleTable(): void {
    this.showTable = !this.showTable;
    // this.laziload(this.ticket.id);

  }
}
