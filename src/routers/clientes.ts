import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { obtenerClientes, obtenerClientePorId, crearCliente, actualizarCliente, eliminarCliente } from '../controllers/clienteControllers';

export const manejarRutasClientes = (req: IncomingMessage, res: ServerResponse, parsedUrl: URL): void => {
    const method = req.method;
    const pathname = parsedUrl.pathname;
    const partes = pathname.split('/').filter(Boolean);

    if (method === 'GET' && partes.length === 1) {
        obtenerClientes(req, res);
    } else if (method === 'GET' && partes.length === 2) {
        obtenerClientePorId(req, res, partes[1]);
    } else if (method === 'POST' && partes.length === 1) {
        crearCliente(req, res);
    } else if (method === 'PUT' && partes.length === 2) {
        actualizarCliente(req, res, partes[1]);
    } else if (method === 'DELETE' && partes.length === 2) {
        eliminarCliente(req, res, partes[1]);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};