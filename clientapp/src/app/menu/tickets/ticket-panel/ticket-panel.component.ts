import { Component, Injector, Input, ViewContainerRef, inject } from '@angular/core';

@Component({
  selector: 'ticket-panel',
  templateUrl: './ticket-panel.component.html',
  styleUrls: ['./ticket-panel.component.css']
})
export class TicketPanelComponent {
  @Input({required:true}) ticket;
  showTable = false;
  container = inject(ViewContainerRef);
  constructor(private parentInjector: Injector){}
  ngOnInit() {
  }
  // createInjector(): Injector {
  //   return Injector.create({
  //     parent: this.parentInjector,
  //     providers: [{provide: 'ticketId', useValue: this.ticket.id}],
  //     name: this.replyTableComponent.name
  //   });
  // }

  async injectCOmponent(){
    this.container.clear();
    const {ReplyTableComponent} = await import('@app/menu/reply/reply-table/reply-table.component');
    const ref = this.container.createComponent(ReplyTableComponent);
    ref.setInput('ticketId', this.ticket.id);
  }
  toggleTable(): void {
    this.showTable = !this.showTable;
    // this.laziload(this.ticket.id);
    this.container.clear();
  }
}
