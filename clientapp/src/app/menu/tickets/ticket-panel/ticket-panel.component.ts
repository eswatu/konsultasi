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
  toggleTable(): void {
    this.showTable = !this.showTable;
  }
}
