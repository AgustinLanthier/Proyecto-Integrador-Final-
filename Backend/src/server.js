import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/salud', (req, res) => {
    res.json({ ok: true });
});

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, '0.0.0.0', () => {
    console.log(`Servidor en http://localhost:${PUERTO}`);
});