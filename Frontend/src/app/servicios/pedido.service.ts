import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { EstadoPedido, ItemPedido, Pedido } from '../modelos/pedido.model';
import { MenuService } from './menu.service';

@Injectable({ providedIn: 'root' })
export class PedidoService {
    /* Cambiar, es solo prueba */
    private pedidos$ = new BehaviorSubject<Pedido[]>([
        {
            id: 100, mesaId: 1, estado: 'listo', fecha: new Date(),
            items: [{ productoId: 3, nombre: 'Milanesa con papas', precioUnitario: 9500, cantidad: 2 }]
        },
        {
            id: 101, mesaId: 2, estado: 'pendiente', fecha: new Date(),
            items: [{ productoId: 1, nombre: 'Coca-Cola 500ml', precioUnitario: 2500, cantidad: 1 }]
        },
    ]);
    private nextId = 102;

    readonly todos$ = this.pedidos$.asObservable();

    constructor(private menu: MenuService) { }

    // Cliente -> Sistema: "Datos del pedido"
    crearPedido(mesaId: number, items: ItemPedido[]): boolean {
        if (!items.every(i => this.menu.hayStock(i.productoId, i.cantidad))) return false;
        items.forEach(i => this.menu.descontarStock(i.productoId, i.cantidad));
        const nuevo: Pedido = {
            id: this.nextId++,
            mesaId,
            items: items.map(i => ({ ...i })),
            estado: 'pendiente',
            fecha: new Date(),
        };
        this.pedidos$.next([...this.pedidos$.value, nuevo]);
        return true;
    }

    // Cocina / Mozo: cambia el estado del pedido
    cambiarEstado(pedidoId: number, estado: EstadoPedido): void {
        this.pedidos$.next(
            this.pedidos$.value.map(p => (p.id === pedidoId ? { ...p, estado } : p))
        );
    }
    pedidosActualesDeMesa(mesaId: number): Pedido[] {
        return this.pedidos$.value.filter(p => p.mesaId === mesaId);
    }
    cerrarMesa(mesaId: number): void {
        this.pedidos$.next(this.pedidos$.value.filter(p => p.mesaId !== mesaId));
    }

    // Sistema -> Cocina: comandas activas
    readonly comandas$ = this.todos$.pipe(
        map(ps => ps.filter(p => p.estado === 'pendiente' || p.estado === 'en_preparacion'))
    );

    // Sistema -> Mozo / Cliente: pedidos de una mesa
    pedidosDeMesa$(mesaId: number) {
        return this.todos$.pipe(map(ps => ps.filter(p => p.mesaId === mesaId)));
    }

    // Sistema -> Cliente: "Cuenta"
    cuentaDeMesa$(mesaId: number) {
        return this.pedidosDeMesa$(mesaId).pipe(
            map(ps => ps.reduce((t, p) => t + p.items.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0), 0))
        );
    }
}