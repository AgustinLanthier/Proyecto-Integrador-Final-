import { verificar } from '../utilidades/jwt.js';
import { ErrorHttp } from '../utilidades/errores.js';

export function autenticar(req, res, next) {
    const [tipo, token] = (req.headers.authorization || '').split(' ');
    if (tipo !== 'Bearer' || !token) throw new ErrorHttp(401, 'Falta el token');

    try {
        req.usuario = verificar(token);
    } catch {
        throw new ErrorHttp(401, 'Token inválido o vencido');
    }
    next();
}