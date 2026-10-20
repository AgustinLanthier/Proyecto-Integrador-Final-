import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { MenuService } from '../../servicios/menu.service';
import { Rol, Usuario } from '../../modelos/usuario.model';
import { Producto } from '../../modelos/producto.model';
import { MesaService } from '../../servicios/mesa.service';
import { PedidoService } from '../../servicios/pedido.service';
import { Mesa } from '../../modelos/mesa.model';


@Component({
  selector: 'app-admin',
  standalone: false,
  styleUrl: './admin.component.scss',
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  // Usuarios
  usuarios: Usuario[] = [];
  nombre = '';
  usuario = '';
  clave = '';
  rol: Rol = 'mozo';
  error = '';

  // Mesas
  mesas: Mesa[] = [];
  errorMesas = '';

  // Carta
  productos: Producto[] = [];
  nuevo: Omit<Producto, 'id'> = { nombre: '', descripcion: '', precio: 0, categoria: '', stock: 0 };
  errorCarta = '';

  constructor(
    public auth: AutenticacionService,
    private menu: MenuService,
    private mesaService: MesaService,
    private pedidos: PedidoService
  ) {
    this.cargar();
    this.menu.menu$.pipe(takeUntilDestroyed()).subscribe(p => (this.productos = p.map(x => ({ ...x }))));
    this.mesaService.todas$.pipe(takeUntilDestroyed()).subscribe(m => (this.mesas = m));
  }

  
  // ---- Usuarios ----
  cargar(): void {
    this.usuarios = this.auth.listarUsuarios();
  }

  crear(): void {
    if (!this.nombre || !this.usuario || !this.clave) {
      this.error = 'Completá todos los campos';
      return;
    }
    const err = this.auth.crearUsuario(this.nombre, this.usuario, this.clave, this.rol);
    this.error = err ?? '';
    if (!err) {
      this.nombre = this.usuario = this.clave = '';
      this.cargar();
    }
  }

  eliminar(id: number): void {
    this.auth.eliminarUsuario(id);
    this.cargar();
  }

  // ---- Mesas ----
  agregarMesa(): void {
    this.mesaService.agregar();
  }
  eliminarMesa(id: number): void {
    if (this.pedidos.pedidosActualesDeMesa(id).length) {
      this.errorMesas = 'La mesa tiene pedidos activos';
      return;
    }
    this.errorMesas = '';
    this.mesaService.eliminar(id);
  }

  // Claves
  clavesNuevas: Record<number, string> = {};
  errorClave = '';

  cambiarClave(id: number): void {
    const err = this.auth.cambiarClave(id, this.clavesNuevas[id] ?? '');
    this.errorClave = err ?? '';
    if (!err) this.clavesNuevas[id] = '';
  }
  
  // ---- Carta ----
  agregarProducto(): void {
    const n = this.nuevo;
    if (!n.nombre || !n.categoria || n.precio <= 0 || n.stock < 0) {
      this.errorCarta = 'Completá nombre, categoría, precio y stock';
      return;
    }
    this.menu.agregar(n);
    this.nuevo = { nombre: '', descripcion: '', precio: 0, categoria: '', stock: 0 };
    this.errorCarta = '';
  }

  guardarProducto(p: Producto): void {
    if (!p.nombre || p.precio <= 0 || p.stock < 0) {
      this.errorCarta = 'Datos inválidos en ' + (p.nombre || 'producto');
      return;
    }
    this.errorCarta = '';
    this.menu.actualizar(p);
  }

  eliminarProducto(id: number): void {
    this.menu.eliminar(id);
  }
}
