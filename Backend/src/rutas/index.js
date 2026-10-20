import { Router } from 'express';
import salud from './salud.routes.js';
import autenticacion from './autenticacion.routes.js';
import productos from './productos.routes.js';

const router = Router();

router.use('/salud', salud);
router.use('/auth', autenticacion);
router.use('/productos', productos);

export default router;