import { IncomingMessage, ServerResponse } from 'http';
import { manejarRutasClientes } from '../routers/clientes';
import { manejarRutasProductos } from '../routers/productos';

export const manejarRutas = (req: IncomingMessage, res: ServerResponse): void => {
    const parsedUrl = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    if (pathname.startsWith('/clientes')) {
        manejarRutasClientes(req, res, parsedUrl);
    } else if (pathname.startsWith('/productos')) {
        manejarRutasProductos(req, res, parsedUrl);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            error: true, 
            codigo: 404, 
            mensaje: 'Ruta no encontrada' 
        }));
    }
};