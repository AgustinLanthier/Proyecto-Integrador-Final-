import { ItemPedido, Pedido } from './pedido.model';

export interface Ticket {
  numero: number;
  mesaId: number;
  fecha: Date;
  items: ItemPedido[];
  total: number;
}

export interface CuentaMesa {
  pedidos: Pedido[];
  total: number;
  solicitada: boolean;
}