import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Producto } from '../../../modelos/producto.model';
import { ItemPedido } from '../../../modelos/pedido.model';
import { MenuService } from '../../../servicios/menu.service';
import { PedidoService } from '../../../servicios/pedido.service';
import { mensajeDeError } from '../../../utilidades/errores';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  mesaId = 0;
  menu$!: Observable<Producto[]>;
  carrito: ItemPedido[] = [];
  mensaje = '';
  enviando = false;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.mesaId = Number(this.route.snapshot.paramMap.get('mesaId'));
    this.menu$ = this.menuService.menu$;
  }

  categorias(productos: Producto[]): string[] {
    return [...new Set(productos.map(p => p.categoria))];
  }

  porCategoria(productos: Producto[], categoria: string): Producto[] {
    return productos.filter(p => p.categoria === categoria);
  }

  cantidad(productoId: number): number {
    return this.carrito.find(i => i.productoId === productoId)?.cantidad ?? 0;
  }

  agregar(p: Producto): void {
    const item = this.carrito.find(i => i.productoId === p.id);
    if (item) {
      if (item.cantidad < p.stock) item.cantidad++;
    } else if (p.stock > 0) {
      this.carrito.push({ productoId: p.id, nombre: p.nombre, precioUnitario: p.precio, cantidad: 1 });
    }
  }

  quitar(p: Producto): void {
    const item = this.carrito.find(i => i.productoId === p.id);
    if (!item) return;
    item.cantidad--;
    if (item.cantidad === 0) {
      this.carrito = this.carrito.filter(i => i.productoId !== p.id);
    }
  }

  get total(): number {
    return this.carrito.reduce((t, i) => t + i.precioUnitario * i.cantidad, 0);
  }

  get cantidadTotal(): number {
    return this.carrito.reduce((t, i) => t + i.cantidad, 0);
  }

  enviar(): void {
    if (this.carrito.length === 0 || this.enviando) return;
    this.enviando = true;

    this.pedidoService.crearPedido(this.mesaId, this.carrito).subscribe({
      next: () => {
        this.carrito = [];
        this.enviando = false;
        this.menuService.recargar();
        this.avisar('¡Pedido enviado a la cocina!');
      },
      error: e => {
        this.enviando = false;
        this.avisar(mensajeDeError(e));
      },
    });
  }

  private avisar(texto: string): void {
    this.mensaje = texto;
    setTimeout(() => (this.mensaje = ''), 3000);
  }
}