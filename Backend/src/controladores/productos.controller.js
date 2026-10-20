import * as servicio from '../servicios/productos.service.js';
import { ErrorHttp } from '../utilidades/errores.js';

export async function listarActivos(req, res) {
    res.json(await servicio.listarActivos());
}

export async function listarTodos(req, res) {
    res.json(await servicio.listarTodos());
}

export async function crear(req, res) {
    res.status(201).json(await servicio.crear(req.body));
}

export async function actualizar(req, res) {
    res.json(await servicio.actualizar(Number(req.params.id), req.body));
}

export async function guardarImagen(req, res) {
    if (!req.file) throw new ErrorHttp(400, 'Falta el archivo de imagen');
    res.json(await servicio.guardarImagen(Number(req.params.id), `/uploads/${req.file.filename}`));
}

export async function desactivar(req, res) {
    await servicio.desactivar(Number(req.params.id));
    res.status(204).end();
}