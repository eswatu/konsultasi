import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketsComponent } from './tickets/tickets.component';


const routes: Routes = [
  {path: '', component: TicketsComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
],
exports: [RouterModule]
})
export class TicketRoutingModule { }
