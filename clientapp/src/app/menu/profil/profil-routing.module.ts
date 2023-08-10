import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilComponent } from './profil/profil.component';
import { ProfilTabComponent } from './profil-tab/profil-tab.component';

const routes: Routes = [
  {path: '', component: ProfilTabComponent}
]

@NgModule({
  declarations: [],
  imports: [
RouterModule.forChild(routes)
],
exports: [RouterModule]
})
export class ProfilRoutingModule { }