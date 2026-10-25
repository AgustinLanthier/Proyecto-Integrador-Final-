import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { API } from '../configuracion/api';
import { EstadoPedido, ItemPedido, Pedido } from '../modelos/pedido.model';
import { actualizar } from '../utilidades/actualizador';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private recarga$ = new Subject<void>();

  // Cocina: comandas activas, se actualizan solas cada 3 s
  readonly comandas$ = actualizar(() => this.http.get<Pedido[]>(`${API}/pedidos/activos`), 3000, this.recarga$);

  // Cliente -> Sistema: "Datos del pedido" (el servidor pone nombres y precios)
  crearPedido(mesaId: number, items: ItemPedido[]): Observable<Pedido> {
    return this.http.post<Pedido>(`${API}/pedidos`, {
      mesaId,
      items: items.map(i => ({ productoId: i.productoId, cantidad: i.cantidad })),
    });
  }

  // Cocina / Mozo: cambia el estado del pedido
  cambiarEstado(pedidoId: number, estado: EstadoPedido): Observable<Pedido> {
    return this.http
      .patch<Pedido>(`${API}/pedidos/${pedidoId}/estado`, { estado })
      .pipe(tap(() => this.recarga$.next()));
  }
}