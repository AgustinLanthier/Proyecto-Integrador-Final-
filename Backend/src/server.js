import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/salud', (req, res) => {
    res.json({ ok: true });
});

app.get('/api/salud/db', async (req, res) => {
    try {
        const [filas] = await pool.query('SELECT COUNT(*) AS productos FROM productos');
        res.json({ ok: true, ...filas[0] });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, '0.0.0.0', () => {
    console.log(`Servidor en http://localhost:${PUERTO}`);
});