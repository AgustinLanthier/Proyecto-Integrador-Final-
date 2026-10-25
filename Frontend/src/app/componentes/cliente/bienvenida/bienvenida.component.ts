import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../servicios/cliente.service';

@Component({
  selector: 'app-bienvenida',
  standalone: false,
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.scss',
})
export class BienvenidaComponent implements OnInit {
  mesaId = 0;
  nombre = '';
  error = false;
  invalida = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cliente: ClienteService
  ) {}

  ngOnInit(): void {
    this.mesaId = Number(this.route.snapshot.paramMap.get('mesaId'));
    this.invalida = !Number.isInteger(this.mesaId) || this.mesaId <= 0;
    this.nombre = this.cliente.nombre(this.mesaId) ?? '';
  }

  entrar(): void {
    const limpio = this.nombre.trim();
    if (!limpio) {
      this.error = true;
      return;
    }
    this.cliente.guardarNombre(this.mesaId, limpio);
    this.router.navigate(['/cliente', this.mesaId, 'carta']);
  }
}