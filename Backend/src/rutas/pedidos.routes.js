import { Router } from 'express';
import * as c from '../controladores/pedidos.controller.js';
import { autenticar } from '../middlewares/autenticacion.js';
import { permitirRoles } from '../middlewares/rol.js';

const router = Router();

router.post('/', c.crear);                                                         // cliente (QR), sin login
router.get('/activos', autenticar, permitirRoles('cocina'), c.activos);            // comandas de cocina
router.patch('/:id/estado', autenticar, permitirRoles('cocina', 'mozo'), c.cambiarEstado);

export default router;