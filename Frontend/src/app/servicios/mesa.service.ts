import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Mesa } from '../modelos/mesa.model';

@Injectable({ providedIn: 'root' })
export class MesaService {
  private readonly CLAVE = 'mesas';
  private mesas$ = new BehaviorSubject<Mesa[]>(this.cargar());

  readonly todas$ = this.mesas$.asObservable();

  agregar(): void {
    const lista = this.mesas$.value;
    const id = Math.max(0, ...lista.map(m => m.id)) + 1;
    const numero = Math.max(0, ...lista.map(m => m.numero)) + 1;
    this.guardar([...lista, { id, numero, ocupada: false }]);
  }

  eliminar(id: number): void {
    this.guardar(this.mesas$.value.filter(m => m.id !== id));
  }

  private cargar(): Mesa[] {
    try {
      const raw = localStorage.getItem(this.CLAVE);
      if (raw) return JSON.parse(raw);
    } catch { }
    return Array.from({ length: 10 }, (_, i) => ({ id: i + 1, numero: i + 1, ocupada: false }));
  }

  private guardar(lista: Mesa[]): void {
    localStorage.setItem(this.CLAVE, JSON.stringify(lista));
    this.mesas$.next(lista);
  }
}