import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketFormComponent } from './ticket-form/ticket-form.component';
import { TicketsComponent } from './tickets/tickets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketMaterialModule } from './ticket-material.module';



@NgModule({
  declarations: [
    TicketsComponent,
    TicketFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TicketMaterialModule
  ]
})
export class TicketsModule { }
