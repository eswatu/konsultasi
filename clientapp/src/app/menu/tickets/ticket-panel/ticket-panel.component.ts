import { Component, Injector, Input, ViewContainerRef, inject } from '@angular/core';

@Component({
  selector: 'ticket-panel',
  templateUrl: './ticket-panel.component.html',
  styleUrls: ['./ticket-panel.component.css']
})
export class TicketPanelComponent {
  @Input({required:true}) ticket;
  showTable = false;
  ngOnInit() {
  }
  // createInjector(): Injector {
  //   return Injector.create({
  //     parent: this.parentInjector,
  //     providers: [{provide: 'ticketId', useValue: this.ticket.id}],
  //     name: this.replyTableComponent.name
  //   });
  // }


  toggleTable(): void {
    this.showTable = !this.showTable;
  }
}
