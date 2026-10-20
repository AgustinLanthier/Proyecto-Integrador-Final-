import { Pedido } from './pedido.model';

export type EstadoMesa = 'libre' | 'ocupada' | 'cuenta';

export interface Mesa {
  id: number;
  numero: number;
  ocupada: boolean;
}


export interface MesaVista {
  mesaId: number;
  pedidos: Pedido[];
  total: number;
  estado: EstadoMesa;
}