USE restaurante;

ALTER TABLE pedidos
    MODIFY estado ENUM('pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado')
    NOT NULL DEFAULT 'pendiente';

ALTER TABLE cuentas
    ADD COLUMN token CHAR(32) NULL,
    ADD UNIQUE KEY uq_cuentas_token (token);