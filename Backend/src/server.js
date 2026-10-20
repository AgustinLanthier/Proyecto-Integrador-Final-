import app from './app.js';
import { entorno } from './config/entorno.js';

app.listen(entorno.puerto, '0.0.0.0', () => {
    console.log(`Servidor en http://localhost:${entorno.puerto}`);
});