import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PedidoService } from '../../../servicios/pedido.service';
import { AutenticacionService } from '../../../servicios/autenticacion.service';
import { Pedido } from '../../../modelos/pedido.model';
import { MesaVista } from '../../../modelos/mesa.model';



@Component({
  selector: 'app-mesas',
  standalone: false,
  templateUrl: './mesas.component.html',
  styleUrl: './mesas.component.scss',
})
export class MesasComponent {
  mesas$!: import("rxjs").Observable<MesaVista[]>;

  constructor(private pedidoService: PedidoService, private auth: AutenticacionService) {
    this.mesas$ = this.pedidoService.todos$.pipe(
      map(pedidos => {
        const porMesa = new Map<number, Pedido[]>();
        pedidos.forEach(p => porMesa.set(p.mesaId, [...(porMesa.get(p.mesaId) ?? []), p]));
        return [...porMesa.entries()]
          .sort((a, b) => a[0] - b[0])
          .map(([mesaId, ps]): MesaVista => ({
            mesaId,
            pedidos: ps,
            total: ps.reduce((t, p) => t + p.items.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0), 0),
          }));
      })
    );

  }

  entregar(pedidoId: number): void {
    this.pedidoService.cambiarEstado(pedidoId, 'entregado');
  }

  salir(): void {
    this.auth.logout();
  }
}