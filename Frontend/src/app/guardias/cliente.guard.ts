import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ClienteService } from '../servicios/cliente.service';

export const clienteGuard: CanActivateFn = (route) => {
    const mesaId = Number(route.paramMap.get('mesaId'));

    if (inject(ClienteService).nombre(mesaId)) return true;
    return inject(Router).createUrlTree(['/cliente', mesaId]);
};