USE restaurante;

ALTER TABLE usuarios
    MODIFY rol ENUM('mozo', 'cocina', 'admin') NOT NULL;

ALTER TABLE productos
    ADD COLUMN imagen_url VARCHAR(255) NULL,
    ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE cuentas
    MODIFY estado ENUM('abierta', 'solicitada', 'cerrada') NOT NULL DEFAULT 'abierta';