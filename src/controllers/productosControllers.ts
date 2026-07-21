import { IncomingMessage, ServerResponse } from 'http';
import { productoService } from '../service/productoService';
import { Producto } from '../models/producto';

export const obtenerProductos = (req: IncomingMessage, res: ServerResponse): void => {
    try {
        const productos = productoService.obtenerTodos();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(productos));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al obtener los productos' }));
    }
};

export const obtenerProductoPorId = (req: IncomingMessage, res: ServerResponse, id: string): void => {
    try {
        const producto = productoService.obtenerPorId(id);
        if (!producto) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Producto no encontrado' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(producto));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al buscar el producto' }));
    }
};

export const crearProducto = (req: IncomingMessage, res: ServerResponse): void => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            const nuevoProducto: Producto = JSON.parse(body);
            if (!nuevoProducto.id || !nuevoProducto.nombre) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Faltan campos obligatorios (id, nombre)' }));
                return;
            }
            const productoCreado = productoService.crear(nuevoProducto);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(productoCreado));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'JSON malformado' }));
        }
    });
};

export const actualizarProducto = (req: IncomingMessage, res: ServerResponse, id: string): void => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            const datos = JSON.parse(body);
            const productoActualizado = productoService.actualizar(id, datos);
            if (!productoActualizado) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Producto no encontrado para actualizar' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(productoActualizado));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al actualizar' }));
        }
    });
};

export const eliminarProducto = (req: IncomingMessage, res: ServerResponse, id: string): void => {
    try {
        const eliminado = productoService.eliminar(id);
        if (!eliminado) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Producto no encontrado para eliminar' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Producto eliminado exitosamente' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al eliminar el producto' }));
    }
};