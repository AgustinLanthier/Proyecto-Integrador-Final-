import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Ticket } from '../modelos/cuenta.model';
import { ItemPedido } from '../modelos/pedido.model';
import { PedidoService } from './pedido.service';

@Injectable({ providedIn: 'root' })
export class CuentaService {
  private pedidas$ = new BehaviorSubject<number[]>([2]); // mesas que pidieron la cuenta
  private nextTicket = 1;

  readonly mesasConCuentaPedida$ = this.pedidas$.asObservable();

  constructor(private pedidoService: PedidoService) {}

  // Cliente -> Sistema -> Mozo: "Solicitud de cuenta"
  pedirCuenta(mesaId: number): void {
    if (this.estaSolicitada(mesaId)) return;
    this.pedidas$.next([...this.pedidas$.value, mesaId]);
  }

  estaSolicitada(mesaId: number): boolean {
    return this.pedidas$.value.includes(mesaId);
  }

  solicitada$(mesaId: number) {
    return this.pedidas$.pipe(map(ids => ids.includes(mesaId)));
  }

  // Mozo: cobra, genera el ticket y cierra la mesa
  cobrar(mesaId: number): Ticket | null {
    const pedidos = this.pedidoService.pedidosActualesDeMesa(mesaId);
    if (pedidos.length === 0) return null;

    // Junta los productos repetidos de todos los pedidos
    const porProducto = new Map<number, ItemPedido>();
    pedidos.forEach(p =>
      p.items.forEach(i => {
        const previo = porProducto.get(i.productoId);
        porProducto.set(
          i.productoId,
          previo ? { ...previo, cantidad: previo.cantidad + i.cantidad } : { ...i }
        );
      })
    );

    const items = [...porProducto.values()];
    const total = items.reduce((t, i) => t + i.precioUnitario * i.cantidad, 0);

    const ticket: Ticket = { numero: this.nextTicket++, mesaId, fecha: new Date(), items, total };

    this.pedidoService.cerrarMesa(mesaId);
    this.pedidas$.next(this.pedidas$.value.filter(id => id !== mesaId));
    return ticket;
  }
}