import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion.service';

@Component({
  selector: 'app-login',
  standalone: false,
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  usuario = '';
  clave = '';
  error = '';

  constructor(private auth: AutenticacionService, private router: Router) { }

  ingresar(): void {
    const user = this.auth.login(this.usuario, this.clave);
    if (!user) {
      this.error = 'Usuario o clave incorrectos';
      return;
    }
    this.router.navigate([this.auth.rutaPorRol(user.rol)]);
  }
}