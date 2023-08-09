import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilMaterialModule } from './profil-material.module';
import { ProfilComponent } from './profil/profil.component';
import { ProfilRoutingModule } from './profil-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserTableComponent } from './user-table/user-table.component';
import { UserFormComponent } from './user-form/user-form.component';



@NgModule({
  declarations: [
    ProfilComponent,
    UserTableComponent,
    UserFormComponent
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
