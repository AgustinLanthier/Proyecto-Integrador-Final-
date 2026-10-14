import { Pedido } from './pedido.model';
export interface Mesa {
    id: number;
    numero: number;
    ocupada: boolean;
}

export interface MesaVista {
    mesaId: number;
    pedidos: Pedido[];
    total: number;
}