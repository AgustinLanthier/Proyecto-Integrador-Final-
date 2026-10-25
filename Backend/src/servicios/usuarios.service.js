import bcrypt from 'bcryptjs';
import { pool } from '../config/baseDatos.js';
import { ErrorHttp } from '../utilidades/errores.js';

const ROLES = ['mozo', 'cocina', 'admin'];

export async function listar() {
    const [filas] = await pool.query('SELECT id, nombre, usuario, rol FROM usuarios ORDER BY id');
    return filas;
}

export async function crear({ nombre, usuario, clave, rol } = {}) {
    if (!nombre || !usuario || !clave) throw new ErrorHttp(400, 'Completá nombre, usuario y clave');
    if (String(clave).length < 4) throw new ErrorHttp(400, 'La clave debe tener al menos 4 caracteres');
    if (!ROLES.includes(rol)) throw new ErrorHttp(400, 'Rol inválido');

    const hash = await bcrypt.hash(String(clave), 10);
    try {
        const [r] = await pool.query(
            'INSERT INTO usuarios (nombre, usuario, clave_hash, rol) VALUES (?, ?, ?, ?)',
            [nombre, usuario, hash, rol]
        );
        return { id: r.insertId, nombre, usuario, rol };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') throw new ErrorHttp(409, 'El usuario ya existe');
        throw error;
    }
}

export async function eliminar(id, idActual) {
    if (id === idActual) throw new ErrorHttp(409, 'No podés eliminar tu propio usuario');
    const [r] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    if (r.affectedRows === 0) throw new ErrorHttp(404, 'Usuario no encontrado');
}

export async function cambiarClave(id, clave) {
    if (!clave || String(clave).length < 4) throw new ErrorHttp(400, 'La clave debe tener al menos 4 caracteres');

    const [filas] = await pool.query('SELECT rol FROM usuarios WHERE id = ?', [id]);
    if (!filas[0]) throw new ErrorHttp(404, 'Usuario no encontrado');
    if (filas[0].rol === 'admin') throw new ErrorHttp(400, 'Solo se puede cambiar la clave de mozo o cocina');

    const hash = await bcrypt.hash(String(clave), 10);
    await pool.query('UPDATE usuarios SET clave_hash = ? WHERE id = ?', [hash, id]);
}