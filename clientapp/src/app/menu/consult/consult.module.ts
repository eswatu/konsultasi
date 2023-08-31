import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { ConsultMaterialModule } from './consult-material.module';
import { FormsModule } from '@angular/forms';
import { ConsultRoutingModule } from './consult-routing.module';
import { MainFrameComponent } from './main-frame/main-frame.component';

@NgModule({
  declarations: [
    ChatComponent,
    MainFrameComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ConsultMaterialModule,
    ConsultRoutingModule,
  ]
})
export class ConsultModule { }
