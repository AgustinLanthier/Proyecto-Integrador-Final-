import jwt from 'jsonwebtoken';
import { entorno } from '../config/entorno.js';

export const firmar = (payload) =>
    jwt.sign(payload, entorno.jwtSecreto, { expiresIn: entorno.jwtExpira });

export const verificar = (token) => jwt.verify(token, entorno.jwtSecreto);