import { IncomingMessage, ServerResponse } from 'http';
import { clienteService } from '../service/clientesService';
import { Cliente } from '../service/clientesService';

export const obtenerClientes = (req: IncomingMessage, res: ServerResponse): void => {
    try {
        const clientes = clienteService.obtenerTodos();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(clientes));
    } catch {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al obtener los clientes' }));
    }
};

export const obtenerClientePorId = (req: IncomingMessage, res: ServerResponse, id: string): void => {
    try {
        const cliente = clienteService.obtenerPorId(id);
        if (!cliente) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Cliente no encontrado' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cliente));
    } catch {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al buscar el cliente' }));
    }
};

export const crearCliente = (req: IncomingMessage, res: ServerResponse): void => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            const nuevoCliente: Cliente = JSON.parse(body);
            const resultado = clienteService.crear(nuevoCliente);

            if (!resultado.exito) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: resultado.mensaje }));
                return;
            }

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(resultado.cliente));
        } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'JSON malformado' }));
        }
    });
};

export const actualizarCliente = (req: IncomingMessage, res: ServerResponse, id: string): void => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            const datos = JSON.parse(body);
            const resultado = clienteService.actualizar(id, datos);

            if (!resultado.exito) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: resultado.mensaje }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(resultado.cliente));
        } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al actualizar el cliente' }));
        }
    });
};

export const eliminarCliente = (req: IncomingMessage, res: ServerResponse, id: string): void => {
    try {
        const eliminado = clienteService.eliminar(id);
        if (!eliminado) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Cliente no encontrado para eliminar' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Cliente eliminado exitosamente' }));
    } catch {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al eliminar el cliente' }));
    }
};