import { Component } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { Mesa } from '../../../modelos/mesa.model';
import { Pedido } from '../../../modelos/pedido.model';
import { Ticket } from '../../../modelos/cuenta.model';
import { MesaService } from '../../../servicios/mesa.service';
import { PedidoService } from '../../../servicios/pedido.service';
import { CuentaService } from '../../../servicios/cuenta.service';
import { AutenticacionService } from '../../../servicios/autenticacion.service';

interface MesaVista {
  mesa: Mesa;
  pedidos: Pedido[];
  total: number;
  cuentaPedida: boolean;
}

@Component({
  selector: 'app-mesas',
  standalone: false,
  templateUrl: './mesas.component.html',
  styleUrl: './mesas.component.scss',
})
export class MesasComponent {
  mesas$: Observable<MesaVista[]>;
  seleccionadaId: number | null = null;
  confirmandoMesaId: number | null = null;
  ticket: Ticket | null = null;

  constructor(
    private mesaService: MesaService,
    private pedidoService: PedidoService,
    private cuentaService: CuentaService,
    private auth: AutenticacionService
  ) {
    this.mesas$ = combineLatest([
      this.mesaService.todas$,
      this.pedidoService.todos$,
      this.cuentaService.mesasConCuentaPedida$,
    ]).pipe(
      map(([mesas, pedidos, pedidas]) =>
        mesas.map((mesa): MesaVista => {
          const ps = pedidos.filter(p => p.mesaId === mesa.id);
          return {
            mesa: { ...mesa, ocupada: ps.length > 0 },
            pedidos: ps,
            total: ps.reduce((t, p) => t + this.subtotal(p), 0),
            cuentaPedida: pedidas.includes(mesa.id),
          };
        })
      )
    );
  }

  seleccionada(mesas: MesaVista[]): MesaVista | undefined {
    return mesas.find(m => m.mesa.id === this.seleccionadaId);
  }

  subtotal(p: Pedido): number {
    return p.items.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0);
  }

  abrir(id: number): void {
    this.seleccionadaId = id;
  }

  volver(): void {
    this.seleccionadaId = null;
  }

  entregar(pedidoId: number): void {
    this.pedidoService.cambiarEstado(pedidoId, 'entregado');
  }

  // Botón "A pagar": si hay pedidos sin entregar, pide confirmación con el modal
  pagar(m: MesaVista): void {
    const sinEntregar = m.pedidos.some(p => p.estado !== 'entregado');
    if (sinEntregar) {
      this.confirmandoMesaId = m.mesa.id;
    } else {
      this.cobrar(m.mesa.id);
    }
  }

  confirmarCobro(): void {
    if (this.confirmandoMesaId !== null) this.cobrar(this.confirmandoMesaId);
    this.confirmandoMesaId = null;
  }

  cancelarCobro(): void {
    this.confirmandoMesaId = null;
  }

  private cobrar(mesaId: number): void {
    this.ticket = this.cuentaService.cobrar(mesaId);
    this.seleccionadaId = null;
  }

  cerrarTicket(): void {
    this.ticket = null;
  }

  imprimir(): void {
    window.print();
  }

  salir(): void {
    this.auth.logout();
  }
}