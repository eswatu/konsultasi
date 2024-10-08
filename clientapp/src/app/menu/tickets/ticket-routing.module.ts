import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketTabComponent } from './ticket-tab/ticket-tab.component';


const routes: Routes = [
  {path: '',
    component: TicketTabComponent,
    children: [
          { path: 'tickets', component: TicketTabComponent }
  ]},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
],
exports: [RouterModule]
})
export class TicketRoutingModule { }
