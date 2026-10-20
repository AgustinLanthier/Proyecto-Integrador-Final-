import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ErrorHttp } from '../utilidades/errores.js';

export const CARPETA_SUBIDAS = fileURLToPath(new URL('../../uploads/', import.meta.url));
fs.mkdirSync(CARPETA_SUBIDAS, { recursive: true });

const EXTENSIONES = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

export const subirImagen = multer({
    storage: multer.diskStorage({
        destination: CARPETA_SUBIDAS,
        filename: (req, file, cb) =>
            cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${EXTENSIONES[file.mimetype]}`),
    }),
    fileFilter: (req, file, cb) =>
        EXTENSIONES[file.mimetype] ? cb(null, true) : cb(new ErrorHttp(400, 'Solo se permiten JPG, PNG o WEBP')),
    limits: { fileSize: 2 * 1024 * 1024 },
}).single('imagen');