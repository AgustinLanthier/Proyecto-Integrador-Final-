import express from 'express';
import cors from 'cors';
import rutas from './rutas/index.js';
import { CARPETA_SUBIDAS } from './middlewares/subida.js';
import { noEncontrado, manejarErrores } from './middlewares/errores.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(CARPETA_SUBIDAS));
app.use('/api', rutas);
app.use(noEncontrado);
app.use(manejarErrores);

export default app;