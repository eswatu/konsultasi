import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { ConsultMaterialModule } from './consult-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultRoutingModule } from './consult-routing.module';
import { MainFrameComponent } from './main-frame/main-frame.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { ChatService } from '@app/_services/chat.service';
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
    ChatComponent,
    MainFrameComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConsultMaterialModule,
    ConsultRoutingModule,
  ],
  providers: [
    ChatService,
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    ]
})
export class ConsultModule { }
