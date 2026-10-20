import { Router } from 'express';
import { pool } from '../config/baseDatos.js';

const router = Router();

router.get('/', (req, res) => res.json({ ok: true }));

router.get('/db', async (req, res) => {
    const [filas] = await pool.query('SELECT COUNT(*) AS productos FROM productos');
    res.json({ ok: true, ...filas[0] });
});

export default router;