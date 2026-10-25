import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API } from '../configuracion/api';
import { LoginRespuesta, Rol, Usuario } from '../modelos/usuario.model';

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
    private readonly CLAVE = 'sesion';
    private http = inject(HttpClient);
    private router = inject(Router);

    login(usuario: string, clave: string): Observable<LoginRespuesta> {
        return this.http
            .post<LoginRespuesta>(`${API}/auth/login`, { usuario, clave })
            .pipe(tap(r => sessionStorage.setItem(this.CLAVE, JSON.stringify(r))));
    }

    logout(): void {
        sessionStorage.removeItem(this.CLAVE);
        this.router.navigate(['/login']);
    }

    rutaPorRol(rol: Rol): string {
        return '/' + rol;
    }

    // ---- Gestión de usuarios (admin) ----
    listarUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${API}/usuarios`);
    }

    crearUsuario(nombre: string, usuario: string, clave: string, rol: Rol): Observable<Usuario> {
        return this.http.post<Usuario>(`${API}/usuarios`, { nombre, usuario, clave, rol });
    }

    eliminarUsuario(id: number): Observable<void> {
        return this.http.delete<void>(`${API}/usuarios/${id}`);
    }

    cambiarClave(id: number, clave: string): Observable<void> {
        return this.http.patch<void>(`${API}/usuarios/${id}/clave`, { clave });
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
        const raw = sessionStorage.getItem(this.CLAVE);
        return raw ? JSON.parse(raw) : null;
    }
}