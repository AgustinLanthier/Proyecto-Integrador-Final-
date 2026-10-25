import { Component, signal } from '@angular/core';
import * as QRCode from 'qrcode';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { MenuService } from '../../servicios/menu.service';
import { MesaService } from '../../servicios/mesa.service';
import { Rol, Usuario } from '../../modelos/usuario.model';
import { Producto } from '../../modelos/producto.model';
import { Mesa } from '../../modelos/mesa.model';
import { mensajeDeError } from '../../utilidades/errores';

type Seccion = 'carta' | 'mesas' | 'usuarios' | 'qr';

@Component({
  selector: 'app-admin',
  standalone: false,
  styleUrl: './admin.component.scss',
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  seccion: Seccion | null = null;
    readonly secciones: { id: Seccion;  titulo: string; detalle: string }[] = [
    { id: 'carta', titulo: 'Carta', detalle: 'Productos, precios y stock' },
    { id: 'mesas', titulo: 'Mesas', detalle: 'Agregar y quitar mesas' },
    { id: 'usuarios', titulo: 'Usuarios', detalle: 'Mozos, cocina y claves' },
    { id: 'qr', titulo: "QR's",  detalle: 'Códigos para cada mesa' },
  ];

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

  // QR
  urlBase = localStorage.getItem('qr-base') || location.origin;
  qrs = signal<{ mesa: Mesa; url: string; imagen: string }[]>([]);

  constructor(
    public auth: AutenticacionService,
    private menu: MenuService,
    private mesaService: MesaService
  ) {
    this.cargarUsuarios();
    this.cargarMesas();
    this.cargarProductos();
  }

  abrir(s: Seccion): void {
    this.seccion = s;
  }

  volver(): void {
    this.seccion = null;
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
    this.mesaService.listar().subscribe(m => {
      this.mesas = m;
      this.generarQrs();
    });
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

  // ---- Códigos QR ----
  get urlLocal(): boolean {
    return /localhost|127\.0\.0\.1/.test(this.urlBase);
  }

  async generarQrs(): Promise<void> {
    localStorage.setItem('qr-base', this.urlBase);
    const base = this.urlBase.trim().replace(/\/+$/, '');

    this.qrs.set(
      await Promise.all(
        this.mesas.map(async mesa => {
          const url = `${base}/cliente/${mesa.id}`;
          const imagen = await QRCode.toDataURL(url, { width: 280, margin: 2, errorCorrectionLevel: 'M' });
          return { mesa, url, imagen };
        })
      )
    );
  }

  imprimirQrs(): void {
    window.print();
  }
}