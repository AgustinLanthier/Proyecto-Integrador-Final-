import { pool } from '../config/baseDatos.js';
import { ErrorHttp } from '../utilidades/errores.js';
import { totalDe } from '../utilidades/pedidos.js';
import * as pedidos from './pedidos.service.js';

async function abierta(mesaId) {
    const [f] = await pool.query(
        "SELECT id, estado, nombre_cliente AS nombreCliente FROM cuentas WHERE mesa_id = ? AND estado <> 'cerrada' ORDER BY id DESC LIMIT 1",
        [mesaId]
    );
    return f[0] ?? null;
}

export async function deMesa(mesaId) {
    const cuenta = await abierta(mesaId);
    if (!cuenta) return { pedidos: [], total: 0, solicitada: false, nombreCliente: null };

    const lista = await pedidos.porCuentas([cuenta.id]);
    return {
        pedidos: lista,
        total: totalDe(lista),
        solicitada: cuenta.estado === 'solicitada',
        nombreCliente: cuenta.nombreCliente,
    };
}

export async function solicitar(mesaId) {
    const cuenta = await abierta(mesaId);
    if (!cuenta) throw new ErrorHttp(409, 'La mesa no tiene pedidos');

    await pool.query("UPDATE cuentas SET estado = 'solicitada' WHERE id = ?", [cuenta.id]);
    return deMesa(mesaId);
}

export async function cobrar(mesaId) {
    const cuenta = await abierta(mesaId);
    if (!cuenta) throw new ErrorHttp(409, 'La mesa no tiene una cuenta abierta');

    const lista = await pedidos.porCuentas([cuenta.id]);

    const agrupados = new Map();
    for (const p of lista) {
        for (const i of p.items) {
            const clave = `${i.productoId}-${i.precioUnitario}`;
            const previo = agrupados.get(clave);
            agrupados.set(clave, previo ? { ...previo, cantidad: previo.cantidad + i.cantidad } : { ...i });
        }
    }
    const items = [...agrupados.values()];

    await pool.query("UPDATE cuentas SET estado = 'cerrada', fecha_cierre = NOW() WHERE id = ?", [cuenta.id]);

    return {
        numero: cuenta.id,
        mesaId,
        nombreCliente: cuenta.nombreCliente,
        fecha: new Date(),
        items,
        total: totalDe([{ items }]),
    };
}