export type Rol = 'mozo' | 'cocina' | 'admin';

export interface Usuario {
    id: number;
    nombre: string;
    usuario: string;
    rol: Rol;
}

export interface UsuarioConClave extends Usuario {
    clave: string;
}

export interface LoginRespuesta {
    token: string;
    usuario: Usuario;
}