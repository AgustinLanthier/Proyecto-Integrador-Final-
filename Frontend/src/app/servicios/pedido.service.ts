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

    readonly comandas$ = actualizar(() => this.http.get<Pedido[]>(`${API}/pedidos/activos`), 3000, this.recarga$);


    crearPedido(mesaId: number, items: ItemPedido[], nombreCliente?: string): Observable<Pedido> {
        return this.http.post<Pedido>(`${API}/pedidos`, {
            mesaId,
            nombreCliente,
            items: items.map(i => ({ productoId: i.productoId, cantidad: i.cantidad })),
        });
    }

    cambiarEstado(pedidoId: number, estado: EstadoPedido): Observable<Pedido> {
        return this.http
            .patch<Pedido>(`${API}/pedidos/${pedidoId}/estado`, { estado })
            .pipe(tap(() => this.recarga$.next()));
    }
}