import * as servicio from '../servicios/usuarios.service.js';

export async function listar(req, res) {
    res.json(await servicio.listar());
}

export async function crear(req, res) {
    res.status(201).json(await servicio.crear(req.body));
}

export async function eliminar(req, res) {
    await servicio.eliminar(Number(req.params.id), req.usuario.id);
    res.status(204).end();
}

export async function cambiarClave(req, res) {
    await servicio.cambiarClave(Number(req.params.id), req.body?.clave);
    res.status(204).end();
}