import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplyTableComponent } from './reply-table/reply-table.component';
import { ReplyMaterialModule } from './reply.material.module';
import { ReplyformComponent } from './replyform/replyform.component';

@NgModule({
  declarations: [ReplyTableComponent, ReplyformComponent],
  imports: [
    CommonModule,
    ReplyMaterialModule,
  ],
  exports: [ReplyTableComponent]
})
export class ReplyModule { }
