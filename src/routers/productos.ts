import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { obtenerProductos, obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto } from '../controllers/productosControllers';

export const manejarRutasProductos = (req: IncomingMessage, res: ServerResponse, parsedUrl: URL): void => {
    const method = req.method;
    const pathname = parsedUrl.pathname;
    const partes = pathname.split('/').filter(Boolean);

    if (method === 'GET' && partes.length === 1) {
        obtenerProductos(req, res);
    } else if (method === 'GET' && partes.length === 2) {
        obtenerProductoPorId(req, res, partes[1]);
    } else if (method === 'POST' && partes.length === 1) {
        crearProducto(req, res);
    } else if (method === 'PUT' && partes.length === 2) {
        actualizarProducto(req, res, partes[1]);
    } else if (method === 'DELETE' && partes.length === 2) {
        eliminarProducto(req, res, partes[1]);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};