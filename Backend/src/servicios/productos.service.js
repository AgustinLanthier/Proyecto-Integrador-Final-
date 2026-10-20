import { pool } from '../config/baseDatos.js';
import { ErrorHttp } from '../utilidades/errores.js';

const COLUMNAS = 'id, nombre, descripcion, precio, categoria, stock, imagen_url AS imagenUrl, activo';
const CAMPOS = ['nombre', 'descripcion', 'precio', 'categoria', 'stock', 'activo'];

const aProducto = (f) => ({ ...f, activo: Boolean(f.activo) });

function limpiar(datos = {}, completo = false) {
    const d = {};
    for (const c of CAMPOS) if (datos[c] !== undefined) d[c] = datos[c];

    if (completo) {
        for (const c of ['nombre', 'precio', 'categoria']) {
            if (d[c] === undefined || d[c] === '') throw new ErrorHttp(400, `Falta el campo ${c}`);
        }
    }
    if (d.precio !== undefined && (d.precio === '' || !(Number(d.precio) >= 0))) {
        throw new ErrorHttp(400, 'Precio inválido');
    }
    if (d.stock !== undefined && (d.stock === '' || !Number.isInteger(Number(d.stock)) || Number(d.stock) < 0)) {
        throw new ErrorHttp(400, 'Stock inválido');
    }
    if (d.activo !== undefined) d.activo = d.activo ? 1 : 0;
    return d;
}

export async function listarActivos() {
    const [f] = await pool.query(`SELECT ${COLUMNAS} FROM productos WHERE activo = 1 ORDER BY categoria, nombre`);
    return f.map(aProducto);
}

export async function listarTodos() {
    const [f] = await pool.query(`SELECT ${COLUMNAS} FROM productos ORDER BY categoria, nombre`);
    return f.map(aProducto);
}

export async function obtener(id) {
    const [f] = await pool.query(`SELECT ${COLUMNAS} FROM productos WHERE id = ?`, [id]);
    if (!f[0]) throw new ErrorHttp(404, 'Producto no encontrado');
    return aProducto(f[0]);
}

export async function crear(datos) {
    const d = limpiar(datos, true);
    const [r] = await pool.query('INSERT INTO productos SET ?', [d]);
    return obtener(r.insertId);
}

export async function actualizar(id, datos) {
    await obtener(id);
    const d = limpiar(datos);
    if (Object.keys(d).length === 0) throw new ErrorHttp(400, 'No hay datos para actualizar');
    await pool.query('UPDATE productos SET ? WHERE id = ?', [d, id]);
    return obtener(id);
}

export async function guardarImagen(id, ruta) {
    await obtener(id);
    await pool.query('UPDATE productos SET imagen_url = ? WHERE id = ?', [ruta, id]);
    return obtener(id);
}

// Baja lógica: no se borra porque los pedidos viejos lo referencian
export async function desactivar(id) {
    await obtener(id);
    await pool.query('UPDATE productos SET activo = 0 WHERE id = ?', [id]);
}