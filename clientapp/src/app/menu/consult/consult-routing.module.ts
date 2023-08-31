import { NgModule } from '@angular/core';
import { ChatComponent } from './chat/chat.component';
import { RouterModule, Routes } from '@angular/router';
import { MainFrameComponent } from './main-frame/main-frame.component';

const routes: Routes = [
  {path: '', component: MainFrameComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConsultRoutingModule { }
