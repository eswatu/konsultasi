import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    {path: 'login', component: LoginComponent },
    {path:'tickets', loadChildren:() => import('./menu/tickets/tickets.module').then(m => m.TicketsModule), canActivate: [AuthGuard]},
    {path:'profil', loadChildren:() => import('./menu/profil/profil.module').then(m => m.ProfilModule), canActivate: [AuthGuard]},
    {path: '**', redirectTo: 'tickets'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }