import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './componentes/cliente/menu/menu.component';
import { CuentaComponent } from './componentes/cliente/cuenta/cuenta.component';
import { MesasComponent } from './componentes/mozo/mesas/mesas.component';
import { ComandasComponent } from './componentes/cocina/comandas/comandas.component';
import { LoginComponent } from './componentes/login/login.component';
import { AdminComponent } from './componentes/admin/admin.component';
import { autenticacionGuard } from './guardias/autenticacion.guard';
import { rolGuard } from './guardias/rol.guard';

const routes: Routes = [
  // Cliente (sin login, entra por QR)
  { path: 'cliente/:mesaId', component: MenuComponent },
  { path: 'cliente/:mesaId/cuenta', component: CuentaComponent },

  // Login universal
  { path: 'login', component: LoginComponent },

  { path: 'mozo', component: MesasComponent, canActivate: [autenticacionGuard, rolGuard], data: { rol: 'mozo' } },
  { path: 'cocina', component: ComandasComponent, canActivate: [autenticacionGuard, rolGuard], data: { rol: 'cocina' } },
  { path: 'admin', component: AdminComponent, canActivate: [autenticacionGuard, rolGuard], data: { rol: 'admin' } },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }