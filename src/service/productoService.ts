import * as fs from 'fs';
import * as path from 'path';
import { Producto } from '../models/producto';

const filePath = path.join(__dirname, '../data/productos.json');

const leerArchivo = (): Producto[] => {
    if (!fs.existsSync(filePath)) {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
};

const escribirArchivo = (productos: Producto[]): void => {
    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
};

export const productoService = {
    obtenerTodos: (): Producto[] => {
        return leerArchivo();
    },

    obtenerPorId: (id: string): Producto | undefined => {
        const productos = leerArchivo();
        return productos.find(p => p.id === id);
    },

    crear: (nuevoProducto: Producto): { exito: boolean; mensaje?: string; producto?: Producto } => {
        const productos = leerArchivo();

        if (productos.some(p => p.id === nuevoProducto.id)) {
            return { exito: false, mensaje: 'El ID del producto ya existe.' };
        }

        if (!nuevoProducto.nombre || nuevoProducto.nombre.trim() === '') {
            return { exito: false, mensaje: 'El nombre no puede estar vacío.' };
        }

        if (!nuevoProducto.categoria || nuevoProducto.categoria.trim() === '') {
            return { exito: false, mensaje: 'La categoría no puede estar vacía.' };
        }

        if (nuevoProducto.precio < 0) {
            return { exito: false, mensaje: 'El precio no puede ser negativo.' };
        }

        if (nuevoProducto.stock < 0) {
            return { exito: false, mensaje: 'El stock no puede ser negativo.' };
        }

        productos.push(nuevoProducto);
        escribirArchivo(productos);
        return { exito: true, producto: nuevoProducto };
    },

    actualizar: (id: string, datosActualizados: Partial<Producto>): { exito: boolean; mensaje?: string; producto?: Producto } => {
        const productos = leerArchivo();
        const index = productos.findIndex(p => p.id === id);
        
        if (index === -1) {
            return { exito: false, mensaje: 'Producto no encontrado.' };
        }

        const productoActual = productos[index];

        if (datosActualizados.nombre !== undefined && datosActualizados.nombre.trim() === '') {
            return { exito: false, mensaje: 'El nombre no puede estar vacío.' };
        }

        if (datosActualizados.categoria !== undefined && datosActualizados.categoria.trim() === '') {
            return { exito: false, mensaje: 'La categoría no puede estar vacía.' };
        }

        if (datosActualizados.precio !== undefined && datosActualizados.precio < 0) {
            return { exito: false, mensaje: 'El precio no puede ser negativo.' };
        }

        if (datosActualizados.stock !== undefined && datosActualizados.stock < 0) {
            return { exito: false, mensaje: 'El stock no puede ser negativo.' };
        }

        productos[index] = { ...productoActual, ...datosActualizados, id };
        escribirArchivo(productos);
        return { exito: true, producto: productos[index] };
    },

    eliminar: (id: string): boolean => {
        const productos = leerArchivo();
        const productosFiltrados = productos.filter(p => p.id !== id);

        if (productos.length === productosFiltrados.length) return false;

        escribirArchivo(productosFiltrados);
        return true;
    }
};