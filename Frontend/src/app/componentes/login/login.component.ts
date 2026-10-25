import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { mensajeDeError } from '../../utilidades/errores';

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

  constructor(private auth: AutenticacionService, private router: Router) {}

  ingresar(): void {
    this.auth.login(this.usuario, this.clave).subscribe({
      next: r => this.router.navigate([this.auth.rutaPorRol(r.usuario.rol)]),
      error: e => (this.error = e.status === 401 ? 'Credenciales incorrectas' : mensajeDeError(e)),
    });
  }
}