import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { API } from '../configuracion/api';
import { CuentaMesa, Ticket } from '../modelos/cuenta.model';
import { actualizar } from '../utilidades/actualizador';

@Injectable({ providedIn: 'root' })
export class CuentaService {
  private http = inject(HttpClient);
  private recarga$ = new Subject<void>();

  // Cliente: su cuenta (pedidos, total y si ya la pidió), se actualiza sola cada 3 s
  deMesa$(mesaId: number): Observable<CuentaMesa> {
    return actualizar(() => this.http.get<CuentaMesa>(`${API}/mesas/${mesaId}/cuenta`), 3000, this.recarga$);
  }

  // Cliente -> Sistema -> Mozo: "Solicitud de cuenta"
  pedirCuenta(mesaId: number): Observable<CuentaMesa> {
    return this.http
      .post<CuentaMesa>(`${API}/mesas/${mesaId}/cuenta/solicitar`, {})
      .pipe(tap(() => this.recarga$.next()));
  }

  // Mozo: cobra, cierra la cuenta y devuelve el ticket
  cobrar(mesaId: number): Observable<Ticket> {
    return this.http.post<Ticket>(`${API}/mesas/${mesaId}/cobrar`, {});
  }
}