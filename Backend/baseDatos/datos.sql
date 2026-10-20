USE restaurante;

INSERT INTO mesas (numero) VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

INSERT INTO productos (nombre, descripcion, precio, categoria, stock) VALUES
  ('Coca-Cola 500ml', 'Gaseosa', 2500, 'Bebidas', 20),
  ('Agua mineral', 'Sin gas', 1800, 'Bebidas', 20),
  ('Milanesa con papas', 'De ternera', 9500, 'Platos', 10),
  ('Ravioles', 'Con salsa a elección', 8800, 'Platos', 10),
  ('Flan casero', 'Con dulce de leche', 4200, 'Postres', 8);
