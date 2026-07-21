import * as fs from 'fs';
import * as path from 'path';
import { IncomingMessage, ServerResponse } from 'http';
import { Producto } from '../models/producto';

const filePath = path.join(__dirname, '../data/productos.json');

export const obtenerProductos = (req: IncomingMessage, res: ServerResponse): void => {
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

export const obtenerProductoPorId = (req: IncomingMessage, res: ServerResponse, id: string): void => {
    try {
        if (!fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Producto no encontrado' }));
            return;
        }
        const data: Producto[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const producto = data.find((p: Producto) => p.id === id);

        if (!producto) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Producto no encontrado' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(producto));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
    }
};

export const crearProducto = (req: IncomingMessage, res: ServerResponse): void => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const nuevoProducto: Producto = JSON.parse(body);
            let productos: Producto[] = [];

            if (fs.existsSync(filePath)) {
                productos = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            }

            productos.push(nuevoProducto);
            fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(nuevoProducto));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
    });
};

export const actualizarProducto = (req: IncomingMessage, res: ServerResponse, id: string): void => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            if (!fs.existsSync(filePath)) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Producto no encontrado' }));
                return;
            }

            let productos: Producto[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const index = productos.findIndex((p: Producto) => p.id === id);

            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Producto no encontrado' }));
                return;
            }

            const datosActualizados = JSON.parse(body);
            productos[index] = { ...productos[index], ...datosActualizados, id };

            fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(productos[index]));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al actualizar' }));
        }
    });
};

export const eliminarProducto = (req: IncomingMessage, res: ServerResponse, id: string): void => {
    try {
        if (!fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Producto no encontrado' }));
            return;
        }

        let productos: Producto[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const nuevosProductos = productos.filter((p: Producto) => p.id !== id);

        if (productos.length === nuevosProductos.length) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Producto no encontrado' }));
            return;
        }

        fs.writeFileSync(filePath, JSON.stringify(nuevosProductos, null, 2));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Producto eliminado correctamente' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
    }
};