import * as servicio from '../servicios/pedidos.service.js';

export async function crear(req, res) {
    const { mesaId, items } = req.body ?? {};
    res.status(201).json(await servicio.crear(Number(mesaId), items));
}

export async function activos(req, res) {
    res.json(await servicio.activos());
}

export async function cambiarEstado(req, res) {
    res.json(await servicio.cambiarEstado(Number(req.params.id), req.body?.estado, req.usuario.rol));
}