import * as fs from 'fs';
import * as path from 'path';

export interface Cliente {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    direccion: string;
    estado: boolean;
}

const filePath = path.join(__dirname, '../data/clientes.json');

const leerArchivo = (): Cliente[] => {
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

const escribirArchivo = (clientes: Cliente[]): void => {
    fs.writeFileSync(filePath, JSON.stringify(clientes, null, 2));
};

export const clienteService = {
    obtenerTodos: (): Cliente[] => {
        return leerArchivo();
    },

    obtenerPorId: (id: string): Cliente | undefined => {
        const clientes = leerArchivo();
        return clientes.find(c => c.id === id);
    },

    crear: (nuevoCliente: Cliente): { exito: boolean; mensaje?: string; cliente?: Cliente } => {
        const clientes = leerArchivo();

        if (clientes.some(c => c.id === nuevoCliente.id)) {
            return { exito: false, mensaje: 'El ID del cliente ya existe.' };
        }

        if (!nuevoCliente.nombre || nuevoCliente.nombre.trim() === '') {
            return { exito: false, mensaje: 'El nombre no puede estar vacío.' };
        }

        if (!nuevoCliente.apellido || nuevoCliente.apellido.trim() === '') {
            return { exito: false, mensaje: 'El apellido no puede estar vacío.' };
        }

        if (!nuevoCliente.correo || nuevoCliente.correo.trim() === '') {
            return { exito: false, mensaje: 'El correo no puede estar vacío.' };
        }

        if (clientes.some(c => c.correo.toLowerCase() === nuevoCliente.correo.toLowerCase())) {
            return { exito: false, mensaje: 'El correo electrónico ya está registrado.' };
        }

        if (!nuevoCliente.telefono || nuevoCliente.telefono.trim() === '') {
            return { exito: false, mensaje: 'El teléfono no puede estar vacío.' };
        }

        clientes.push(nuevoCliente);
        escribirArchivo(clientes);
        return { exito: true, cliente: nuevoCliente };
    },

    actualizar: (id: string, datosActualizados: Partial<Cliente>): { exito: boolean; mensaje?: string; cliente?: Cliente } => {
        const clientes = leerArchivo();
        const index = clientes.findIndex(c => c.id === id);
        
        if (index === -1) {
            return { exito: false, mensaje: 'Cliente no encontrado.' };
        }

        const clienteActual = clientes[index];

        if (datosActualizados.nombre !== undefined && datosActualizados.nombre.trim() === '') {
            return { exito: false, mensaje: 'El nombre no puede estar vacío.' };
        }

        if (datosActualizados.apellido !== undefined && datosActualizados.apellido.trim() === '') {
            return { exito: false, mensaje: 'El apellido no puede estar vacío.' };
        }

        if (datosActualizados.correo !== undefined) {
            if (datosActualizados.correo.trim() === '') {
                return { exito: false, mensaje: 'El correo no puede estar vacío.' };
            }
            const correoRepetido = clientes.some(c => c.correo.toLowerCase() === datosActualizados.correo?.toLowerCase() && c.id !== id);
            if (correoRepetido) {
                return { exito: false, mensaje: 'El correo electrónico ya está registrado por otro cliente.' };
            }
        }

        if (datosActualizados.telefono !== undefined && datosActualizados.telefono.trim() === '') {
            return { exito: false, mensaje: 'El teléfono no puede estar vacío.' };
        }

        clientes[index] = { ...clienteActual, ...datosActualizados, id };
        escribirArchivo(clientes);
        return { exito: true, cliente: clientes[index] };
    },

    eliminar: (id: string): boolean => {
        const clientes = leerArchivo();
        const clientesFiltrados = clientes.filter(c => c.id !== id);

        if (clientes.length === clientesFiltrados.length) return false;

        escribirArchivo(clientesFiltrados);
        return true;
    }
};