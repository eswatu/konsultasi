import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplyTableComponent } from './reply-table/reply-table.component';
import { ReplyMaterialModule } from './reply.material.module';

@NgModule({
  declarations: [ReplyTableComponent],
  imports: [
    CommonModule,
    ReplyMaterialModule
  ],
  exports: [ReplyTableComponent]
})
export class ReplyModule { }
