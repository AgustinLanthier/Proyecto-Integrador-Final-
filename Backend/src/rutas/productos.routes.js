import { Router } from 'express';
import * as c from '../controladores/productos.controller.js';
import { autenticar } from '../middlewares/autenticacion.js';
import { permitirRoles } from '../middlewares/rol.js';
import { subirImagen } from '../middlewares/subida.js';

const router = Router();
const soloAdmin = [autenticar, permitirRoles('admin')];

router.get('/', c.listarActivos);                                   // público (cliente)
router.get('/admin', ...soloAdmin, c.listarTodos);                  // incluye desactivados
router.post('/', ...soloAdmin, c.crear);
router.put('/:id', ...soloAdmin, c.actualizar);
router.post('/:id/imagen', ...soloAdmin, subirImagen, c.guardarImagen);
router.delete('/:id', ...soloAdmin, c.desactivar);

export default router;