import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../../servicios/autenticacion.service';

@Component({
  selector: 'app-login-mozo',
  standalone: false,
  templateUrl: './login-mozo.component.html',
  styleUrl: './login-mozo.component.scss',
})
export class LoginMozoComponent {
  usuario = '';
  clave = '';
  error = false;

  constructor(private auth: AutenticacionService, private router: Router) {}

  ingresar(): void {
    if (this.auth.login(this.usuario, this.clave, 'mozo')) {
      this.router.navigate(['/mozo']);
    } else {
      this.error = true;
    }
  }
}