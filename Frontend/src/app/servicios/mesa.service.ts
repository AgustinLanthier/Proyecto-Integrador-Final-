import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Mesa } from '../modelos/mesa.model';

@Injectable({ providedIn: 'root' })
export class MesaService {
  private mesas$ = new BehaviorSubject<Mesa[]>(
    Array.from({ length: 10 }, (_, i) => ({ id: i + 1, numero: i + 1, ocupada: false }))
  );

  readonly todas$ = this.mesas$.asObservable();
}