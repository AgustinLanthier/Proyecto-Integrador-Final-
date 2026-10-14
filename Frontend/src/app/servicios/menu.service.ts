import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../modelos/producto.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
    private productos$ = new BehaviorSubject<Producto[]>([
        { id: 1, nombre: 'Coca-Cola 500ml', descripcion: 'Gaseosa', precio: 2500, categoria: 'Bebidas', stock: 20 },
        { id: 2, nombre: 'Agua mineral', descripcion: 'Sin gas', precio: 1800, categoria: 'Bebidas', stock: 20 },
        { id: 3, nombre: 'Milanesa con papas', descripcion: 'De ternera', precio: 9500, categoria: 'Platos', stock: 10 },
        { id: 4, nombre: 'Ravioles', descripcion: 'Con salsa a elección', precio: 8800, categoria: 'Platos', stock: 10 },
        { id: 5, nombre: 'Flan casero', descripcion: 'Con dulce de leche', precio: 4200, categoria: 'Postres', stock: 8 },
    ]);

    readonly menu$ = this.productos$.asObservable();

    hayStock(productoId: number, cantidad: number): boolean {
        const p = this.productos$.value.find(x => x.id === productoId);
        return !!p && p.stock >= cantidad;
    }

    descontarStock(productoId: number, cantidad: number): void {
        this.productos$.next(
            this.productos$.value.map(p =>
                p.id === productoId ? { ...p, stock: p.stock - cantidad } : p
            )
        );
    }
}