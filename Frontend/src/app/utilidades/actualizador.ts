import { catchError, EMPTY, merge, Observable, switchMap, timer } from 'rxjs';

// Consulta al backend cada `ms` milisegundos (y cuando llega `recarga`) mientras alguien esté suscripto
export function actualizar<T>(
    consulta: () => Observable<T>,
    ms: number,
    recarga?: Observable<unknown>
): Observable<T> {
    const disparadores = recarga ? merge(timer(0, ms), recarga) : timer(0, ms);
    return disparadores.pipe(switchMap(() => consulta().pipe(catchError(() => EMPTY))));
}