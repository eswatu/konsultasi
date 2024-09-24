import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilComponent } from './profil/profil.component';
import { ProfilTabComponent } from './profil-tab/profil-tab.component';
import { ProfilMaterialModule } from './profil-material.module';

const routes: Routes = [
  {path: '', redirectTo: './mainprofile', pathMatch: 'full'},
  {path: 'mainprofile', component: ProfilTabComponent}
]

@NgModule({
  declarations: [],
  imports: [
RouterModule.forChild(routes)
],
exports: [RouterModule]
})
export class ProfilRoutingModule { }