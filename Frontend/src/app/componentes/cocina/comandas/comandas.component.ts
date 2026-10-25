import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../../../modelos/pedido.model';
import { PedidoService } from '../../../servicios/pedido.service';
import { AutenticacionService } from '../../../servicios/autenticacion.service';
import { mensajeDeError } from '../../../utilidades/errores';

@Component({
  selector: 'app-comandas',
  standalone: false,
  templateUrl: './comandas.component.html',
  styleUrl: './comandas.component.scss',
})
export class ComandasComponent {
  comandas$: Observable<Pedido[]>;
  error = '';

  constructor(private pedidoService: PedidoService, private auth: AutenticacionService) {
    this.comandas$ = this.pedidoService.comandas$;
  }

  preparar(id: number): void {
    this.cambiar(id, 'en_preparacion');
  }

  listo(id: number): void {
    this.cambiar(id, 'listo');
  }

  private cambiar(id: number, estado: 'en_preparacion' | 'listo'): void {
    this.pedidoService.cambiarEstado(id, estado).subscribe({
      next: () => (this.error = ''),
      error: e => (this.error = mensajeDeError(e)),
    });
  }

  salir(): void {
    this.auth.logout();
  }
}