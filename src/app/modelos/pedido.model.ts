export type EstadoPedido = 'pendiente' | 'en_preparacion' | 'listo' | 'entregado';

export interface ItemPedido {
    productoId: number;
    nombre: string;
    precioUnitario: number;
    cantidad: number;
}

export interface Pedido {
    id: number;
    mesaId: number;
    items: ItemPedido[];
    estado: EstadoPedido;
    fecha: Date;
}