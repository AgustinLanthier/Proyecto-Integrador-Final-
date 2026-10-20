import { ItemPedido } from './pedido.model';

export interface Ticket {
  numero: number;
  mesaId: number;
  fecha: Date;
  items: ItemPedido[];
  total: number;
}