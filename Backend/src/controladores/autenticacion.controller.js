import * as servicio from '../servicios/autenticacion.service.js';
import { ErrorHttp } from '../utilidades/errores.js';

export async function login(req, res) {
    const { usuario, clave } = req.body ?? {};
    if (!usuario || !clave) throw new ErrorHttp(400, 'Faltan credenciales');
    res.json(await servicio.login(usuario, clave));
}