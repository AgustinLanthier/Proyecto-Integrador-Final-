import { Component } from '@angular/core';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { MenuService } from '../../servicios/menu.service';
import { MesaService } from '../../servicios/mesa.service';
import { Rol, Usuario } from '../../modelos/usuario.model';
import { Producto } from '../../modelos/producto.model';
import { Mesa } from '../../modelos/mesa.model';
import { mensajeDeError } from '../../utilidades/errores';

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
  clavesNuevas: Record<number, string> = {};
  errorClave = '';

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
    private mesaService: MesaService
  ) {
    this.cargarUsuarios();
    this.cargarMesas();
    this.cargarProductos();
  }

  // ---- Usuarios ----
  private cargarUsuarios(): void {
    this.auth.listarUsuarios().subscribe(u => (this.usuarios = u));
  }

  crear(): void {
    if (!this.nombre || !this.usuario || !this.clave) {
      this.error = 'Completá todos los campos';
      return;
    }
    this.auth.crearUsuario(this.nombre, this.usuario, this.clave, this.rol).subscribe({
      next: () => {
        this.error = '';
        this.nombre = this.usuario = this.clave = '';
        this.cargarUsuarios();
      },
      error: e => (this.error = mensajeDeError(e)),
    });
  }

  eliminar(id: number): void {
    this.auth.eliminarUsuario(id).subscribe({
      next: () => {
        this.errorClave = '';
        this.cargarUsuarios();
      },
      error: e => (this.errorClave = mensajeDeError(e)),
    });
  }

  cambiarClave(id: number): void {
    this.auth.cambiarClave(id, this.clavesNuevas[id] ?? '').subscribe({
      next: () => {
        this.errorClave = '';
        this.clavesNuevas[id] = '';
      },
      error: e => (this.errorClave = mensajeDeError(e)),
    });
  }

  // ---- Mesas ----
  private cargarMesas(): void {
    this.mesaService.listar().subscribe(m => (this.mesas = m));
  }

  agregarMesa(): void {
    this.mesaService.agregar().subscribe({
      next: () => {
        this.errorMesas = '';
        this.cargarMesas();
      },
      error: e => (this.errorMesas = mensajeDeError(e)),
    });
  }

  eliminarMesa(id: number): void {
    this.mesaService.eliminar(id).subscribe({
      next: () => {
        this.errorMesas = '';
        this.cargarMesas();
      },
      error: e => (this.errorMesas = mensajeDeError(e)),
    });
  }

  // ---- Carta ----
  private cargarProductos(): void {
    this.menu.listar().subscribe(p => (this.productos = p));
  }

  agregarProducto(): void {
    const n = this.nuevo;
    if (!n.nombre || !n.categoria || n.precio <= 0 || n.stock < 0) {
      this.errorCarta = 'Completá nombre, categoría, precio y stock';
      return;
    }
    this.menu.agregar(n).subscribe({
      next: p => {
        this.productos = [...this.productos, p];
        this.nuevo = { nombre: '', descripcion: '', precio: 0, categoria: '', stock: 0 };
        this.errorCarta = '';
      },
      error: e => (this.errorCarta = mensajeDeError(e)),
    });
  }

  guardarProducto(p: Producto): void {
    if (!p.nombre || p.precio <= 0 || p.stock < 0) {
      this.errorCarta = 'Datos inválidos en ' + (p.nombre || 'producto');
      return;
    }
    this.menu.actualizar(p).subscribe({
      next: actualizado => {
        Object.assign(p, actualizado);
        this.errorCarta = '';
      },
      error: e => (this.errorCarta = mensajeDeError(e)),
    });
  }

  eliminarProducto(id: number): void {
    this.menu.eliminar(id).subscribe({
      next: () => (this.productos = this.productos.filter(x => x.id !== id)),
      error: e => (this.errorCarta = mensajeDeError(e)),
    });
  }
}