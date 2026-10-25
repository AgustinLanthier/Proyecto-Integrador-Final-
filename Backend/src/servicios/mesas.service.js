import { pool } from '../config/baseDatos.js';
import { ErrorHttp } from '../utilidades/errores.js';
import { totalDe } from '../utilidades/pedidos.js';
import * as pedidos from './pedidos.service.js';

export async function listar() {
    const [mesas] = await pool.query('SELECT id, numero FROM mesas ORDER BY numero');
    const [cuentas] = await pool.query(
        "SELECT id, mesa_id AS mesaId, estado, nombre_cliente AS nombreCliente FROM cuentas WHERE estado <> 'cerrada'"
    );
    const lista = await pedidos.porCuentas(cuentas.map(c => c.id));

    return mesas.map(m => {
        const cuenta = cuentas.find(c => c.mesaId === m.id);
        const ps = cuenta ? lista.filter(p => p.cuentaId === cuenta.id) : [];
        return {
            id: m.id,
            numero: m.numero,
            ocupada: ps.length > 0,
            cuentaPedida: cuenta?.estado === 'solicitada',
            nombreCliente: cuenta?.nombreCliente ?? null,
            total: totalDe(ps),
            pedidos: ps,
        };
    });
}

export async function crear() {
    const [[{ proximo }]] = await pool.query('SELECT COALESCE(MAX(numero), 0) + 1 AS proximo FROM mesas');
    const [r] = await pool.query('INSERT INTO mesas (numero) VALUES (?)', [proximo]);
    return { id: r.insertId, numero: proximo, ocupada: false };
}

export async function eliminar(id) {
    const [m] = await pool.query('SELECT id FROM mesas WHERE id = ?', [id]);
    if (!m[0]) throw new ErrorHttp(404, 'Mesa no encontrada');

    const [[{ cantidad }]] = await pool.query('SELECT COUNT(*) AS cantidad FROM cuentas WHERE mesa_id = ?', [id]);
    if (cantidad > 0) throw new ErrorHttp(409, 'La mesa tiene historial y no se puede eliminar');

    await pool.query('DELETE FROM mesas WHERE id = ?', [id]);
}