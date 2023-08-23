import { NgModule } from '@angular/core';
import { ChatComponent } from './chat/chat.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', component: ChatComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConsultRoutingModule { }
