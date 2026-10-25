import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CuentaMesa } from '../../../modelos/cuenta.model';
import { Pedido } from '../../../modelos/pedido.model';
import { CuentaService } from '../../../servicios/cuenta.service';
import { mensajeDeError } from '../../../utilidades/errores';

@Component({
  selector: 'app-cuenta',
  standalone: false,
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.scss',
})
export class CuentaComponent implements OnInit {
  mesaId = 0;
  cuenta$!: Observable<CuentaMesa>;
  confirmando = false;
  error = '';

  constructor(private route: ActivatedRoute, private cuentaService: CuentaService) {}

  ngOnInit(): void {
    this.mesaId = Number(this.route.snapshot.paramMap.get('mesaId'));
    this.cuenta$ = this.cuentaService.deMesa$(this.mesaId);
  }

  subtotal(p: Pedido): number {
    return p.items.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0);
  }

  pedirCuenta(): void {
    this.confirmando = true;
  }

  confirmarPedido(): void {
    this.confirmando = false;
    this.cuentaService.pedirCuenta(this.mesaId).subscribe({
      next: () => (this.error = ''),
      error: e => (this.error = mensajeDeError(e)),
    });
  }
}