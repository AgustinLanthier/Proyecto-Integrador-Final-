import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { API } from '../configuracion/api';
import { Mesa, MesaApi, MesaVista } from '../modelos/mesa.model';
import { actualizar } from '../utilidades/actualizador';

const aVista = (m: MesaApi): MesaVista => ({
  mesa: { id: m.id, numero: m.numero, ocupada: m.ocupada },
  pedidos: m.pedidos,
  total: m.total,
  cuentaPedida: m.cuentaPedida,
});

@Injectable({ providedIn: 'root' })
export class MesaService {
  private http = inject(HttpClient);
  private recarga$ = new Subject<void>();

  // Mozo: mesas con pedidos y estado, se actualizan solas cada 3 s
  readonly mesas$: Observable<MesaVista[]> = actualizar(
    () => this.http.get<MesaApi[]>(`${API}/mesas`),
    3000,
    this.recarga$
  ).pipe(map(ms => ms.map(aVista)));

  recargar(): void {
    this.recarga$.next();
  }

  // ---- Admin ----
  listar(): Observable<Mesa[]> {
    return this.http
      .get<MesaApi[]>(`${API}/mesas`)
      .pipe(map(ms => ms.map(m => ({ id: m.id, numero: m.numero, ocupada: m.ocupada }))));
  }

  agregar(): Observable<Mesa> {
    return this.http.post<Mesa>(`${API}/mesas`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/mesas/${id}`);
  }
}