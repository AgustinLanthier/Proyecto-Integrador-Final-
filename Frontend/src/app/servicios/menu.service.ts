import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../modelos/producto.model';

const INICIAL: Producto[] = [
    { id: 1, nombre: 'Coca-Cola 500ml', descripcion: 'Gaseosa', precio: 2500, categoria: 'Bebidas', stock: 20 },
    { id: 2, nombre: 'Agua mineral', descripcion: 'Sin gas', precio: 1800, categoria: 'Bebidas', stock: 20 },
    { id: 3, nombre: 'Milanesa con papas', descripcion: 'De ternera', precio: 9500, categoria: 'Platos', stock: 10 },
    { id: 4, nombre: 'Ravioles', descripcion: 'Con salsa a elección', precio: 8800, categoria: 'Platos', stock: 10 },
    { id: 5, nombre: 'Flan casero', descripcion: 'Con dulce de leche', precio: 4200, categoria: 'Postres', stock: 8 },
];

@Injectable({ providedIn: 'root' })
export class MenuService {
    private readonly CLAVE = 'menu';
    private productos$ = new BehaviorSubject<Producto[]>(this.cargar());

    readonly menu$ = this.productos$.asObservable();

    hayStock(productoId: number, cantidad: number): boolean {
        const p = this.productos$.value.find(x => x.id === productoId);
        return !!p && p.stock >= cantidad;
    }

    descontarStock(productoId: number, cantidad: number): void {
        this.guardar(
            this.productos$.value.map(p =>
                p.id === productoId ? { ...p, stock: p.stock - cantidad } : p
            )
        );
    }

    // ---- Admin ----
    agregar(p: Omit<Producto, 'id'>): void {
        const id = Math.max(0, ...this.productos$.value.map(x => x.id)) + 1;
        this.guardar([...this.productos$.value, { ...p, id }]);
    }

    actualizar(p: Producto): void {
        this.guardar(this.productos$.value.map(x => (x.id === p.id ? { ...p } : x)));
    }

    eliminar(id: number): void {
        this.guardar(this.productos$.value.filter(x => x.id !== id));
    }

    private cargar(): Producto[] {
        try {
            const raw = localStorage.getItem(this.CLAVE);
            return raw ? JSON.parse(raw) : INICIAL;
        } catch {
            return INICIAL;
        }
    }

    private guardar(lista: Producto[]): void {
        localStorage.setItem(this.CLAVE, JSON.stringify(lista));
        this.productos$.next(lista);
    }
}