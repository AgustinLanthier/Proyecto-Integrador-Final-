import * as servicio from '../servicios/cuentas.service.js';

export async function deMesa(req, res) {
    res.json(await servicio.deMesa(Number(req.params.id)));
}

export async function solicitar(req, res) {
    res.json(await servicio.solicitar(Number(req.params.id)));
}

export async function cobrar(req, res) {
    res.json(await servicio.cobrar(Number(req.params.id)));
}