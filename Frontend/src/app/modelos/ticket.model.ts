import { ItemPedido } from './pedido.model';

export interface Ticket {
  numero: string;
  mesaId: number;
  fecha: Date;
  items: ItemPedido[];
  total: number;
}