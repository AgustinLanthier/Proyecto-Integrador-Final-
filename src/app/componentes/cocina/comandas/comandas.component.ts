import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../../../modelos/pedido.model';
import { PedidoService } from '../../../servicios/pedido.service';
import { AutenticacionService } from '../../../servicios/autenticacion.service';

@Component({
  selector: 'app-comandas',
  standalone: false,
  templateUrl: './comandas.component.html',
  styleUrl: './comandas.component.scss',
})
export class ComandasComponent {
  comandas$: Observable<Pedido[]>;

  constructor(private pedidoService: PedidoService, private auth: AutenticacionService) {
    this.comandas$ = this.pedidoService.comandas$;
  }

  preparar(id: number): void {
    this.pedidoService.cambiarEstado(id, 'en_preparacion');
  }

  listo(id: number): void {
    this.pedidoService.cambiarEstado(id, 'listo');
  }

  salir(): void {
    this.auth.logout();
  }
}