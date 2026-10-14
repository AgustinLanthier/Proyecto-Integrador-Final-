export type Rol = 'mozo' | 'cocina';

export interface Usuario {
    id: number;
    nombre: string;
    usuario: string;
    rol: Rol;
}

export interface LoginRespuesta {
    token: string;
    usuario: Usuario;
}