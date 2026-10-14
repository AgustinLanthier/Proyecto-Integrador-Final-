import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion.service';

export const autenticacionGuard: CanActivateFn = (route, state) => {
  const auth = inject(AutenticacionService);
  const router = inject(Router);

  if (auth.estaLogueado()) return true;

  const destino = state.url.startsWith('/cocina') ? '/cocina/login' : '/mozo/login';
  return router.createUrlTree([destino]);
};