import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilMaterialModule } from './profil-material.module';
import { ProfilComponent } from './profil/profil.component';
import { ProfilRoutingModule } from './profil-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProfilComponent
  ],
  imports: [
    CommonModule,
    ProfilMaterialModule,
    ProfilRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfilModule { }
