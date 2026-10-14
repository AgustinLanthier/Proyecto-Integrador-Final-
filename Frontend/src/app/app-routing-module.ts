import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './componentes/cliente/menu/menu.component';
import { CuentaComponent } from './componentes/cliente/cuenta/cuenta.component';
import { MesasComponent } from './componentes/mozo/mesas/mesas.component';
import { LoginMozoComponent } from './componentes/mozo/login-mozo/login-mozo.component';
import { ComandasComponent } from './componentes/cocina/comandas/comandas.component';
import { LoginCocinaComponent } from './componentes/cocina/login-cocina/login-cocina.component';
import { autenticacionGuard } from './guardias/autenticacion.guard';
import { rolGuard } from './guardias/rol.guard';

const routes: Routes = [
  // Cliente (sin login, entra por QR)
  { path: 'cliente/:mesaId', component: MenuComponent },
  { path: 'cliente/:mesaId/cuenta', component: CuentaComponent },

  // Mozo
  { path: 'mozo/login', component: LoginMozoComponent },
  {
    path: 'mozo',
    component: MesasComponent,
    canActivate: [autenticacionGuard, rolGuard],
    data: { rol: 'mozo' },
  },

  // Cocina
  { path: 'cocina/login', component: LoginCocinaComponent },
  {
    path: 'cocina',
    component: ComandasComponent,
    canActivate: [autenticacionGuard, rolGuard],
    data: { rol: 'cocina' },
  },

  { path: '', redirectTo: 'mozo', pathMatch: 'full' },
  { path: '**', redirectTo: 'mozo' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
