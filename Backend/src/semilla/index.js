import bcrypt from 'bcryptjs';
import { pool } from '../config/baseDatos.js';

const usuarios = [
    { nombre: 'Administrador', usuario: 'admin', clave: '1234', rol: 'admin' },
    { nombre: 'Mozo', usuario: 'mozo', clave: '1234', rol: 'mozo' },
    { nombre: 'Cocina', usuario: 'cocina', clave: '1234', rol: 'cocina' },
];

for (const u of usuarios) {
    const hash = await bcrypt.hash(u.clave, 10);
    await pool.query(
        `INSERT INTO usuarios (nombre, usuario, clave_hash, rol) VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE clave_hash = VALUES(clave_hash), rol = VALUES(rol)`,
        [u.nombre, u.usuario, hash, u.rol]
    );
    console.log(`Usuario listo: ${u.usuario} (${u.rol})`);
}

await pool.end();