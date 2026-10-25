export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    stock: number;
    imagenUrl?: string | null;
    activo?: boolean;
}