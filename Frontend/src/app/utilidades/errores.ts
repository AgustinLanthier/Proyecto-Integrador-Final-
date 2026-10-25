import { HttpErrorResponse } from '@angular/common/http';

export function mensajeDeError(e: unknown): string {
    if (e instanceof HttpErrorResponse) {
        if (e.status === 0) return 'No se pudo conectar con el servidor';
        return e.error?.error ?? 'Ocurrió un error inesperado';
    }
    return 'Ocurrió un error inesperado';
}