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
import { LoginMozoComponent } from './componentes/mozo/login-mozo/login-mozo.component';
import { ComandasComponent } from './componentes/cocina/comandas/comandas.component';
import { LoginCocinaComponent } from './componentes/cocina/login-cocina/login-cocina.component';
import { autenticacionInterceptor } from './interceptores/autenticacion.interceptor';

@NgModule({
  declarations: [
    App,
    MenuComponent,
    CuentaComponent,
    MesasComponent,
    LoginMozoComponent,
    ComandasComponent,
    LoginCocinaComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [provideHttpClient(withInterceptors([autenticacionInterceptor]))],
  bootstrap: [App],
})
export class AppModule {}