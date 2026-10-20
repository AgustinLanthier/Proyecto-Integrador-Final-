import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Pedido } from '../../../modelos/pedido.model';
import { PedidoService } from '../../../servicios/pedido.service';
import { CuentaService } from '../../../servicios/cuenta.service';

@Component({
  selector: 'app-cuenta',
  standalone: false,
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.scss',
})
export class CuentaComponent implements OnInit {
  mesaId = 0;
  pedidos$!: Observable<Pedido[]>;
  total$!: Observable<number>;
  solicitada$!: Observable<boolean>;
  confirmando = false;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private cuentaService: CuentaService
  ) { }

  ngOnInit(): void {
    this.mesaId = Number(this.route.snapshot.paramMap.get('mesaId'));
    this.pedidos$ = this.pedidoService.pedidosDeMesa$(this.mesaId);
    this.total$ = this.pedidoService.cuentaDeMesa$(this.mesaId);
    this.solicitada$ = this.cuentaService.solicitada$(this.mesaId);
  }

  subtotal(p: Pedido): number {
    return p.items.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0);
  }

  // Botón "Pedir la cuenta": abre el modal
  pedirCuenta(): void {
    this.confirmando = true;
  }

  confirmarPedido(): void {
    this.cuentaService.pedirCuenta(this.mesaId);
    this.confirmando = false;
  }
}