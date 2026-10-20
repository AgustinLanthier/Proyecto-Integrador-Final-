import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

/* Conexion a HTTP */
import { provideHttpClient, withInterceptors } from '@angular/common/http';

/* Modulo de rutas */
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

/* Componentes */
import { MenuComponent } from './componentes/cliente/menu/menu.component';
import { CuentaComponent } from './componentes/cliente/cuenta/cuenta.component';
import { MesasComponent } from './componentes/mozo/mesas/mesas.component';
import { ComandasComponent } from './componentes/cocina/comandas/comandas.component';
import { autenticacionInterceptor } from './interceptores/autenticacion.interceptor';
import { ModalConfirmacionComponent } from './componentes/compartidos/modal-confirmacion/modal-confirmacion.component';
import { LoginComponent } from './componentes/login/login.component';
import { AdminComponent } from './componentes/admin/admin.component';

@NgModule({
  declarations: [
    App,
    MenuComponent,
    CuentaComponent,
    MesasComponent,
    ComandasComponent,
    ModalConfirmacionComponent,
    LoginComponent,
    AdminComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [provideHttpClient(withInterceptors([autenticacionInterceptor]))],
  bootstrap: [App],
})
export class AppModule {}
