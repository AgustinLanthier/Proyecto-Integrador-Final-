export class ErrorHttp extends Error {
    constructor(estado, mensaje) {
        super(mensaje);
        this.estado = estado;
    }
}