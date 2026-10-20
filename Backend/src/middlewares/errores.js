export function noEncontrado(req, res) {
    res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
}

export function manejarErrores(err, req, res, next) {
    const estado = err.name === 'MulterError' ? 400 : err.estado || 500;
    if (estado === 500) console.error(err);
    res.status(estado).json({ ok: false, error: estado === 500 ? 'Error interno del servidor' : err.message });
}