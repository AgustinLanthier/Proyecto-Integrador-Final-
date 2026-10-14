import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRespuesta, Rol, Usuario } from '../modelos/usuario.model';

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
    private readonly CLAVE = 'sesion';

    constructor(private router: Router) { }

    login(usuario: string, clave: string, rol: Rol): boolean {
        const valido = usuario === rol && clave === '1234';
        if (!valido) return false;

        const respuesta: LoginRespuesta = {
            token: 'token-falso-' + rol,
            usuario: { id: 1, nombre: usuario, usuario, rol },
        };
        localStorage.setItem(this.CLAVE, JSON.stringify(respuesta));
        return true;
    }

    logout(): void {
        const rol = this.usuarioActual?.rol;
        localStorage.removeItem(this.CLAVE);
        this.router.navigate([rol === 'cocina' ? '/cocina/login' : '/mozo/login']);
    }

    get token(): string | null {
        return this.sesion?.token ?? null;
    }

    get usuarioActual(): Usuario | null {
        return this.sesion?.usuario ?? null;
    }

    estaLogueado(): boolean {
        return !!this.token;
    }

    tieneRol(rol: Rol): boolean {
        return this.usuarioActual?.rol === rol;
    }

    private get sesion(): LoginRespuesta | null {
        const raw = localStorage.getItem(this.CLAVE);
        return raw ? JSON.parse(raw) : null;
    }
}