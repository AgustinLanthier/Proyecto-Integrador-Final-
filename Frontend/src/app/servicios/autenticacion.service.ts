import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRespuesta, Rol, Usuario, UsuarioConClave } from '../modelos/usuario.model';

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
    private readonly CLAVE = 'sesion';
    private readonly CLAVE_USUARIOS = 'usuarios';

    constructor(private router: Router) { }

    login(usuario: string, clave: string): Usuario | null {
        const u = this.todos.find(x => x.usuario === usuario && x.clave === clave);
        if (!u) return null;

        const { clave: _, ...publico } = u;
        const respuesta: LoginRespuesta = { token: 'token-falso-' + u.rol, usuario: publico };
        localStorage.setItem(this.CLAVE, JSON.stringify(respuesta));
        return publico;
    }

    logout(): void {
        localStorage.removeItem(this.CLAVE);
        this.router.navigate(['/login']);
    }

    rutaPorRol(rol: Rol): string {
        return '/' + rol;
    }

    // ---- Gestión de usuarios (admin) ----
    listarUsuarios(): Usuario[] {
        return this.todos.map(({ clave, ...u }) => u);
    }

    crearUsuario(nombre: string, usuario: string, clave: string, rol: Rol): string | null {
        const lista = this.todos;
        if (lista.some(u => u.usuario === usuario)) return 'El usuario ya existe';
        const id = Math.max(0, ...lista.map(u => u.id)) + 1;
        lista.push({ id, nombre, usuario, clave, rol });
        this.guardar(lista);
        return null;
    }

    eliminarUsuario(id: number): void {
        if (id === this.usuarioActual?.id) return;
        this.guardar(this.todos.filter(u => u.id !== id));
    }

        cambiarClave(id: number, clave: string): string | null {
        const lista = this.todos;
        const u = lista.find(x => x.id === id);
        if (!u || u.rol === 'admin') return 'Solo se puede cambiar la clave de mozo o cocina';
        if (clave.length < 4) return 'La clave debe tener al menos 4 caracteres';
        u.clave = clave;
        this.guardar(lista);
        return null;
    }

    // ---- Sesión ----
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

    private get todos(): UsuarioConClave[] {
        const raw = localStorage.getItem(this.CLAVE_USUARIOS);
        if (raw) return JSON.parse(raw);
        const inicial: UsuarioConClave[] = [
            { id: 1, nombre: 'Mozo', usuario: 'mozo', clave: '1234', rol: 'mozo' },
            { id: 2, nombre: 'Cocina', usuario: 'cocina', clave: '1234', rol: 'cocina' },
            { id: 3, nombre: 'Admin', usuario: 'admin', clave: '1234', rol: 'admin' },
        ];
        this.guardar(inicial);
        return inicial;
    }

    private guardar(lista: UsuarioConClave[]): void {
        localStorage.setItem(this.CLAVE_USUARIOS, JSON.stringify(lista));
    }
}