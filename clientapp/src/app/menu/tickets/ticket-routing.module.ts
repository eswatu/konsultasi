import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketTabComponent } from './ticket-tab/ticket-tab.component';


const routes: Routes = [
  {path: '', component: TicketTabComponent},
  {path:'replyTable', loadChildren: () => import('../reply/reply.module').then(m => m.ReplyModule)},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
],
exports: [RouterModule]
})
export class TicketRoutingModule { }
