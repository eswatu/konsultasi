import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

const modules = [
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonToggleModule
];

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules
})
export class ConsultMaterialModule { }
