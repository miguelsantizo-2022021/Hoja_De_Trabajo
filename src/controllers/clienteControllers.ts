import * as fs from 'fs';
import * as path from 'path';
import { IncomingMessage, ServerResponse } from 'http';
import { Cliente } from '../models/cliente';

const filePath = path.join(__dirname, '../data/clientes.json');

export const obtenerClientes = (req: IncomingMessage, res: ServerResponse): void => {
    try {
        if (!fs.existsSync(filePath)) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([]));
            return;
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
    }
};

export const obtenerClientePorId = (req: IncomingMessage, res: ServerResponse, id: string): void => {
    try {
        if (!fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Cliente no encontrado' }));
            return;
        }
        const data: Cliente[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const cliente = data.find((c: Cliente) => c.id === id);

        if (!cliente) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Cliente no encontrado' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cliente));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
    }
};

export const crearCliente = (req: IncomingMessage, res: ServerResponse): void => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const nuevoCliente: Cliente = JSON.parse(body);
            let clientes: Cliente[] = [];

            if (fs.existsSync(filePath)) {
                clientes = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            }

            clientes.push(nuevoCliente);
            fs.writeFileSync(filePath, JSON.stringify(clientes, null, 2));

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(nuevoCliente));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
    });
};

export const actualizarCliente = (req: IncomingMessage, res: ServerResponse, id: string): void => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            if (!fs.existsSync(filePath)) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Cliente no encontrado' }));
                return;
            }

            let clientes: Cliente[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const index = clientes.findIndex((c: Cliente) => c.id === id);

            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Cliente no encontrado' }));
                return;
            }

            const datosActualizados = JSON.parse(body);
            clientes[index] = { ...clientes[index], ...datosActualizados, id };

            fs.writeFileSync(filePath, JSON.stringify(clientes, null, 2));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(clientes[index]));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al actualizar' }));
        }
    });
};

export const eliminarCliente = (req: IncomingMessage, res: ServerResponse, id: string): void => {
    try {
        if (!fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Cliente no encontrado' }));
            return;
        }

        let clientes: Cliente[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const nuevosClientes = clientes.filter((c: Cliente) => c.id !== id);

        if (clientes.length === nuevosClientes.length) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Cliente no encontrado' }));
            return;
        }

        fs.writeFileSync(filePath, JSON.stringify(nuevosClientes, null, 2));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Cliente eliminado correctamente' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
    }
};