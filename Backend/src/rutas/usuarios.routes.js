import { Router } from 'express';
import * as c from '../controladores/usuarios.controller.js';
import { autenticar } from '../middlewares/autenticacion.js';
import { permitirRoles } from '../middlewares/rol.js';

const router = Router();

router.use(autenticar, permitirRoles('admin'));

router.get('/', c.listar);
router.post('/', c.crear);
router.delete('/:id', c.eliminar);
router.patch('/:id/clave', c.cambiarClave);

export default router;