import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay, Subject, tap } from 'rxjs';
import { API } from '../configuracion/api';
import { Producto } from '../modelos/producto.model';
import { actualizar } from '../utilidades/actualizador';

@Injectable({ providedIn: 'root' })
export class MenuService {
    private http = inject(HttpClient);
    private recarga$ = new Subject<void>();

    readonly menu$ = actualizar(() => this.http.get<Producto[]>(`${API}/productos`), 5000, this.recarga$).pipe(
        shareReplay({ bufferSize: 1, refCount: true })
    );

    recargar(): void {
        this.recarga$.next();
    }

    // ---- Admin ----
    listar(): Observable<Producto[]> {
        return this.http.get<Producto[]>(`${API}/productos`);
    }

    agregar(p: Omit<Producto, 'id'>): Observable<Producto> {
        return this.http.post<Producto>(`${API}/productos`, p).pipe(tap(() => this.recargar()));
    }

    actualizar(p: Producto): Observable<Producto> {
        const { id, ...datos } = p;
        return this.http.put<Producto>(`${API}/productos/${id}`, datos).pipe(tap(() => this.recargar()));
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${API}/productos/${id}`).pipe(tap(() => this.recargar()));
    }
    
    subirImagen(id: number, archivo: File): Observable<Producto> {
        const datos = new FormData();
        datos.append('imagen', archivo);
        return this.http.post<Producto>(`${API}/productos/${id}/imagen`, datos).pipe(tap(() => this.recargar()));
    }
}