import bcrypt from 'bcryptjs';
import { pool } from '../config/baseDatos.js';
import { firmar } from '../utilidades/jwt.js';
import { ErrorHttp } from '../utilidades/errores.js';

export async function login(usuario, clave) {
    const [filas] = await pool.query(
        'SELECT id, nombre, usuario, clave_hash, rol FROM usuarios WHERE usuario = ?',
        [usuario]
    );
    const u = filas[0];

    if (!u || !(await bcrypt.compare(clave, u.clave_hash))) {
        throw new ErrorHttp(401, 'Usuario o contraseña incorrectos');
    }

    const publico = { id: u.id, nombre: u.nombre, usuario: u.usuario, rol: u.rol };
    return { token: firmar(publico), usuario: publico };
}