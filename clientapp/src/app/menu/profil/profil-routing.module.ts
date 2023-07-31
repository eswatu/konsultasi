import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  {path: '', component: ProfilComponent}
]

@NgModule({
  declarations: [],
  imports: [
RouterModule.forChild(routes)
],
exports: [RouterModule]
})
export class ProfilRoutingModule { }