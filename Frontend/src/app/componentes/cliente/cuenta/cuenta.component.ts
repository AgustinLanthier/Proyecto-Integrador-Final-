import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Pedido } from '../../../modelos/pedido.model';
import { PedidoService } from '../../../servicios/pedido.service';

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

  constructor(private route: ActivatedRoute, private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.mesaId = Number(this.route.snapshot.paramMap.get('mesaId'));
    this.pedidos$ = this.pedidoService.pedidosDeMesa$(this.mesaId);
    this.total$ = this.pedidoService.cuentaDeMesa$(this.mesaId);
  }

  subtotal(p: Pedido): number {
    return p.items.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0);
  }
}