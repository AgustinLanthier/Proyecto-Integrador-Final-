import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClienteService {
    private clave(mesaId: number): string {
        return `cliente-${mesaId}`;
    }

    nombre(mesaId: number): string | null {
        try {
            return sessionStorage.getItem(this.clave(mesaId));
        } catch {
            return null;
        }
    }

    guardarNombre(mesaId: number, nombre: string): void {
        try {
            sessionStorage.setItem(this.clave(mesaId), nombre);
        } catch { }
    }
}