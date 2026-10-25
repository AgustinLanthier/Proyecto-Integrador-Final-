import { Router } from 'express';
import * as mesas from '../controladores/mesas.controller.js';
import * as cuentas from '../controladores/cuentas.controller.js';
import { autenticar } from '../middlewares/autenticacion.js';
import { permitirRoles } from '../middlewares/rol.js';

const router = Router();

// Personal
router.get('/', autenticar, permitirRoles('mozo'), mesas.listar);
router.post('/', autenticar, permitirRoles('admin'), mesas.crear);
router.delete('/:id', autenticar, permitirRoles('admin'), mesas.eliminar);
router.post('/:id/cobrar', autenticar, permitirRoles('mozo'), cuentas.cobrar);

// Cliente (QR), sin login
router.get('/:id/cuenta', cuentas.deMesa);
router.post('/:id/cuenta/solicitar', cuentas.solicitar);

export default router;