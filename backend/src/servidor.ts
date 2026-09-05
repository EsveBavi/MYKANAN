import cors from 'cors';
import express from 'express';
import { entorno } from './configuracion/entorno';
import { manejarErrores, noEncontrado } from './middleware/errores';
import { rutas } from './rutas';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', false);
app.use(
  cors({
    origin: entorno.origenPermitido,
    methods: ['GET', 'POST'],
  }),
);
app.use(express.json({ limit: '16kb' }));

app.use('/api', rutas);
app.use(noEncontrado);
app.use(manejarErrores);

app.listen(entorno.puerto, () => {
  console.log(`[mykanan] API escuchando en http://localhost:${entorno.puerto}`);
});
