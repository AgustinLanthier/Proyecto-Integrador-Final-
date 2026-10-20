CREATE DATABASE IF NOT EXISTS restaurante
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE restaurante;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  usuario VARCHAR(40) NOT NULL UNIQUE,
  clave_hash VARCHAR(255) NOT NULL,
  rol ENUM('mozo', 'cocina') NOT NULL,
  turno ENUM('manana', 'tarde', 'noche') NULL
);

CREATE TABLE mesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL UNIQUE,
  disponible BOOLEAN NOT NULL DEFAULT TRUE,
  mozo_id INT NULL,
  FOREIGN KEY (mozo_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  precio DECIMAL(10, 2) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  stock INT NOT NULL DEFAULT 0
);

CREATE TABLE cuentas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mesa_id INT NOT NULL,
  nombre_cliente VARCHAR(80) NULL,
  estado ENUM('abierta', 'cerrada') NOT NULL DEFAULT 'abierta',
  fecha_apertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_cierre DATETIME NULL,
  FOREIGN KEY (mesa_id) REFERENCES mesas(id)
);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cuenta_id INT NOT NULL,
  mesa_id INT NOT NULL,
  modo_entrega ENUM('en_mesa', 'para_llevar') NOT NULL DEFAULT 'en_mesa',
  estado ENUM('pendiente', 'en_preparacion', 'listo', 'entregado')
    NOT NULL DEFAULT 'pendiente',
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cuenta_id) REFERENCES cuentas(id),
  FOREIGN KEY (mesa_id) REFERENCES mesas(id)
);

CREATE TABLE pedido_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  cantidad INT NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);
