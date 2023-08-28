import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { ConsultMaterialModule } from './consult-material.module';
import { FormsModule } from '@angular/forms';
import { ConsultRoutingModule } from './consult-routing.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = {url: 'http://localhost:4000', options: {}};

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ConsultMaterialModule,
    ConsultRoutingModule,
    SocketIoModule.forRoot(config)
  ]
})
export class ConsultModule { }
