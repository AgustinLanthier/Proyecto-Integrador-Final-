import { Router } from 'express';
import salud from './salud.routes.js';
import autenticacion from './autenticacion.routes.js';
import productos from './productos.routes.js';
import pedidos from './pedidos.routes.js';
import mesas from './mesas.routes.js';
import usuarios from './usuarios.routes.js';

const router = Router();

router.use('/salud', salud);
router.use('/auth', autenticacion);
router.use('/productos', productos);
router.use('/pedidos', pedidos);
router.use('/mesas', mesas);
router.use('/usuarios', usuarios);

export default router;