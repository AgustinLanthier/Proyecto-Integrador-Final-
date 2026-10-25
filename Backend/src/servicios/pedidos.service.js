import { pool } from '../config/baseDatos.js';
import { ErrorHttp } from '../utilidades/errores.js';
import { agruparPedidos } from '../utilidades/pedidos.js';

const SELECT = `
    SELECT p.id, p.mesa_id AS mesaId, p.cuenta_id AS cuentaId, p.estado, p.fecha,
           i.producto_id AS productoId, i.nombre, i.precio_unitario AS precioUnitario, i.cantidad
    FROM pedidos p
    JOIN pedido_items i ON i.pedido_id = p.id
    JOIN cuentas c ON c.id = p.cuenta_id`;

const SIGUIENTE = { pendiente: 'en_preparacion', en_preparacion: 'listo', listo: 'entregado' };
const PERMISOS = { en_preparacion: ['cocina'], listo: ['cocina'], entregado: ['mozo'] };

export async function porCuentas(cuentaIds) {
    if (cuentaIds.length === 0) return [];
    const [filas] = await pool.query(`${SELECT} WHERE p.cuenta_id IN (?) ORDER BY p.id, i.id`, [cuentaIds]);
    return agruparPedidos(filas);
}

export async function obtener(id) {
    const [filas] = await pool.query(`${SELECT} WHERE p.id = ? ORDER BY i.id`, [id]);
    if (filas.length === 0) throw new ErrorHttp(404, 'Pedido no encontrado');
    return agruparPedidos(filas)[0];
}

// Comandas de cocina: pendientes y en preparación de cuentas todavía abiertas
export async function activos() {
    const [filas] = await pool.query(
        `${SELECT} WHERE c.estado <> 'cerrada' AND p.estado IN ('pendiente', 'en_preparacion') ORDER BY p.id, i.id`
    );
    return agruparPedidos(filas);
}

function limpiarNombre(valor) {
    const nombre = String(valor ?? '').trim().slice(0, 80);
    return nombre || null;
}

export async function crear(mesaId, items, nombreCliente) {
    const nombre = limpiarNombre(nombreCliente);

    if (!Number.isInteger(mesaId)) throw new ErrorHttp(400, 'Mesa inválida');
    if (!Array.isArray(items) || items.length === 0) throw new ErrorHttp(400, 'El pedido no tiene productos');

    // Junta productos repetidos y valida cantidades
    const cantidades = new Map();
    for (const it of items) {
        const productoId = Number(it.productoId);
        const cantidad = Number(it.cantidad);
        if (!Number.isInteger(productoId) || !Number.isInteger(cantidad) || cantidad <= 0) {
            throw new ErrorHttp(400, 'Producto o cantidad inválidos');
        }
        cantidades.set(productoId, (cantidades.get(productoId) ?? 0) + cantidad);
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [mesas] = await conn.query('SELECT id FROM mesas WHERE id = ?', [mesaId]);
        if (!mesas[0]) throw new ErrorHttp(404, 'La mesa no existe');

        // Cuenta abierta de la mesa (si no hay, se crea con el nombre del cliente)
        const [cuentas] = await conn.query(
            "SELECT id, estado, nombre_cliente AS nombreCliente FROM cuentas WHERE mesa_id = ? AND estado <> 'cerrada' ORDER BY id DESC LIMIT 1 FOR UPDATE",
            [mesaId]
        );
        let cuenta = cuentas[0];
        if (cuenta?.estado === 'solicitada') throw new ErrorHttp(409, 'La mesa ya pidió la cuenta');

        if (!cuenta) {
            const [r] = await conn.query('INSERT INTO cuentas (mesa_id, nombre_cliente) VALUES (?, ?)', [mesaId, nombre]);
            cuenta = { id: r.insertId };
        } else if (!cuenta.nombreCliente && nombre) {
            await conn.query('UPDATE cuentas SET nombre_cliente = ? WHERE id = ?', [nombre, cuenta.id]);
        }

        // Productos reales de la base: nombre, precio y stock
        const ids = [...cantidades.keys()];
        const [productos] = await conn.query(
            'SELECT id, nombre, precio, stock, activo FROM productos WHERE id IN (?) FOR UPDATE',
            [ids]
        );
        if (productos.length !== ids.length) throw new ErrorHttp(404, 'Algún producto no existe');

        for (const p of productos) {
            if (!p.activo) throw new ErrorHttp(409, `${p.nombre} no está disponible`);
            if (p.stock < cantidades.get(p.id)) throw new ErrorHttp(409, `Stock insuficiente de ${p.nombre}`);
        }

        const [pedido] = await conn.query('INSERT INTO pedidos (cuenta_id, mesa_id) VALUES (?, ?)', [cuenta.id, mesaId]);
        for (const p of productos) {
            const cantidad = cantidades.get(p.id);
            await conn.query(
                'INSERT INTO pedido_items (pedido_id, producto_id, nombre, precio_unitario, cantidad) VALUES (?, ?, ?, ?, ?)',
                [pedido.insertId, p.id, p.nombre, p.precio, cantidad]
            );
            await conn.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [cantidad, p.id]);
        }

        await conn.commit();
        return obtener(pedido.insertId);
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

export async function cambiarEstado(id, estado, rol) {
    const pedido = await obtener(id);

    if (SIGUIENTE[pedido.estado] !== estado) {
        throw new ErrorHttp(409, `No se puede pasar de ${pedido.estado} a ${estado}`);
    }
    if (rol !== 'admin' && !PERMISOS[estado]?.includes(rol)) {
        throw new ErrorHttp(403, 'No tenés permiso para este cambio de estado');
    }

    await pool.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
    return { ...pedido, estado };
}