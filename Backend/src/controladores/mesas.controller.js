import * as servicio from '../servicios/mesas.service.js';

export async function listar(req, res) {
    res.json(await servicio.listar());
}

export async function crear(req, res) {
    res.status(201).json(await servicio.crear());
}

export async function eliminar(req, res) {
    await servicio.eliminar(Number(req.params.id));
    res.status(204).end();
}