import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import { manejarRutas } from './router';

const PORT = 3000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    manejarRutas(req, res);
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});