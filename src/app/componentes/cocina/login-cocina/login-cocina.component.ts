import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../../servicios/autenticacion.service';

@Component({
  selector: 'app-login-cocina',
  standalone: false,
  templateUrl: './login-cocina.component.html',
  styleUrl: './login-cocina.component.scss',
})
export class LoginCocinaComponent {
  usuario = '';
  clave = '';
  error = false;

  constructor(private auth: AutenticacionService, private router: Router) {}

  ingresar(): void {
    if (this.auth.login(this.usuario, this.clave, 'cocina')) {
      this.router.navigate(['/cocina']);
    } else {
      this.error = true;
    }
  }
}