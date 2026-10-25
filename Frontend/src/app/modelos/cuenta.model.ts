import { ItemPedido, Pedido } from './pedido.model';

export interface Ticket {
  numero: number;
  mesaId: number;
  nombreCliente?: string | null;
  fecha: Date;
  items: ItemPedido[];
  total: number;
}

export interface CuentaMesa {
  pedidos: Pedido[];
  total: number;
  solicitada: boolean;
  nombreCliente: string | null;
}