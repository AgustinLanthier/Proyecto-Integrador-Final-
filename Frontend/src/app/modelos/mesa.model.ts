import { Pedido } from './pedido.model';

export type EstadoMesa = 'libre' | 'ocupada' | 'cuenta';

export interface Mesa {
  id: number;
  numero: number;
  ocupada: boolean;
}

export interface MesaApi extends Mesa {
  cuentaPedida: boolean;
  total: number;
  pedidos: Pedido[];
}

export interface MesaVista {
  mesa: Mesa;
  pedidos: Pedido[];
  total: number;
  cuentaPedida: boolean;
}