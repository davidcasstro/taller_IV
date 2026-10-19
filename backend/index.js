import cors from 'cors';
import express from 'express';

const app = express();
const port = 4000;

app.use(cors());

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    status: 'OK',
    message: 'El API está funcionando correctamente',
  });
});

app.get('/api/info', (_request, response) => {
  response.status(200).json({
    status: 'OK',
    message: 'El API está funcionando correctamente',
    integrantes: [
      {
        nombre: 'Kevin Adolfo Gutierrez Salinas',
        edad: 21,
        carrera: 'Ingeniería Informática',
        // Edita este número o agrega más objetos para incluir otros integrantes.
        materiasAprobadas: 20,
      },
      {
        nombre: 'David Octavio Castro Santamaria',
        edad: 20,
        carrera: 'Ingeniería Informática',
        materiasAprobadas: 0,
      },
    ],
  });
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});