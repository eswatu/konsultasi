import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TicketFormComponent } from './ticket-form/ticket-form.component';
import { TicketsComponent } from './tickets-list/tickets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketMaterialModule } from './ticket-material.module';
import { TicketRoutingModule } from './ticket-routing.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NomorAjuDirective } from "@app/_helpers/pipe/nomorajudirective";
import { TicketTabComponent } from './ticket-tab/ticket-tab.component';
import { TicketPanelComponent } from './ticket-panel/ticket-panel.component';
import { ReplyTableComponent } from './reply-table/reply-table.component';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY'
  }, display : {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
}

@NgModule({
  declarations: [
    TicketsComponent,
    TicketFormComponent,
    NomorAjuDirective,
    TicketTabComponent,
    TicketPanelComponent,
    ReplyTableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TicketMaterialModule,
    TicketRoutingModule,
    MatNativeDateModule,
    MatMomentDateModule,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    ]
})
export class TicketsModule { }
