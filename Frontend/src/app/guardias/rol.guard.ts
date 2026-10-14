import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Rol } from '../modelos/usuario.model';

export const rolGuard: CanActivateFn = (route) => {
  const auth = inject(AutenticacionService);
  const router = inject(Router);
  const rolRequerido = route.data['rol'] as Rol;

  if (auth.tieneRol(rolRequerido)) return true;

  return router.createUrlTree([rolRequerido === 'cocina' ? '/cocina/login' : '/mozo/login']);
};