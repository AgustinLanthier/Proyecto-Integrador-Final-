import { ErrorHttp } from '../utilidades/errores.js';

export const permitirRoles = (...roles) => (req, res, next) => {
    const rol = req.usuario?.rol;
    if (!rol || (rol !== 'admin' && !roles.includes(rol))) {
        throw new ErrorHttp(403, 'No tenés permiso para esta acción');
    }
    next();
};