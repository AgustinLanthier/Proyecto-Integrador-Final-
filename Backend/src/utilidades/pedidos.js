// Convierte las filas pedido+item del SELECT en pedidos con su lista de items
export function agruparPedidos(filas) {
    const mapa = new Map();
    for (const f of filas) {
        if (!mapa.has(f.id)) {
            mapa.set(f.id, {
                id: f.id,
                mesaId: f.mesaId,
                cuentaId: f.cuentaId,
                estado: f.estado,
                fecha: f.fecha,
                items: [],
            });
        }
        mapa.get(f.id).items.push({
            productoId: f.productoId,
            nombre: f.nombre,
            precioUnitario: f.precioUnitario,
            cantidad: f.cantidad,
        });
    }
    return [...mapa.values()];
}

export const totalDe = (pedidos) =>
    pedidos.reduce((t, p) => t + p.items.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0), 0);