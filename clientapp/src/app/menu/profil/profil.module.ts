import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilMaterialModule } from './profil-material.module';
import { ProfilComponent } from './profil/profil.component';
import { ProfilRoutingModule } from './profil-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserTableComponent } from './user-table/user-table.component';
import { ProfilTabComponent } from './profil-tab/profil-tab.component';



@NgModule({
  declarations: [
    ProfilComponent,
    UserTableComponent,
    ProfilTabComponent,
  ],
  imports: [
    CommonModule,
    ProfilMaterialModule,
    ProfilRoutingModule,
    ReactiveFormsModule
  ]
})
export class ProfilModule { }
