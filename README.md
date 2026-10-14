# 🍽️ Sistema de Pedidos para Restaurante

Sistema de gestión de pedidos para locales gastronómicos, desarrollado como **proyecto final de carrera**. No es una página web de presentación: es una herramienta de trabajo para el local, con tres "caras" según quién la use.

| Cara | Quién la usa | Acceso | Qué hace |
|---|---|---|---|
| 🧑‍🍳 **Cliente** | Comensal | Escanea el QR de su mesa (sin login) | Ve la carta, arma su pedido con el botón `+`, lo envía y consulta su cuenta |
| 🧑‍💼 **Mozo** | Personal de salón | Login | Ve las mesas con sus pedidos y marca como entregados los platos listos |
| 👨‍🍳 **Cocina** | Personal de cocina | Login | Recibe las comandas y las pasa a *en preparación* y *plato preparado* |

---

## 🔄 Cómo funciona

1. El cliente escanea el QR de su mesa y abre la carta (`/cliente/:mesaId`).
2. Agrega productos (por ejemplo, una gaseosa con `+`) y envía el pedido.
3. El pedido llega a **cocina** como comanda y se descuenta del **stock**.
4. Cocina lo prepara y avisa "plato preparado".
5. El **mozo** lo entrega a la mesa.
6. Cada pedido se suma a la **cuenta** de la mesa, que el cliente puede ver en cualquier momento.

El diseño sigue los **Diagramas de Flujo de Datos (DFD)** del proyecto (niveles 0, 1 y 2): cada entidad externa es una carpeta de componentes y cada flujo de datos es un método de servicio.

### Estados de un pedido

```
pendiente  →  en_preparacion  →  listo  →  entregado
```

---

## 🛠️ Tecnologías

| Capa | Tecnología | Estado |
|---|---|---|
| Frontend | Angular 20 (módulos, `standalone: false`) + TypeScript + SCSS | ✅ En desarrollo |
| Gestor de paquetes | Bun | ✅ |
| Backend | Node.js + Express | ⏳ Pendiente |
| Base de datos | SQL | ⏳ Pendiente |

---

## 📋 Requisitos

- [Node.js](https://nodejs.org/) (versión LTS)
- [Bun](https://bun.sh/)
- Angular CLI (se usa con `bunx`, no hace falta instalarlo global)

Instalar Bun en Windows (PowerShell):

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

---

## 🚀 Instalación y uso

```powershell
# 1. Clonar el repositorio
git clone <URL-DEL-REPOSITORIO>
cd <NOMBRE-DEL-REPOSITORIO>/Frontend

# 2. Instalar dependencias
bun install

# 3. Levantar el servidor de desarrollo
bunx ng serve
```

La aplicación queda disponible en `http://localhost:4200`.

### Acceder desde el celular (misma red Wi-Fi)

Para probar el flujo del cliente con el celular, levantá el servidor escuchando en todas las interfaces:

```powershell
bunx ng serve --host 0.0.0.0
```

Averiguá la IP de tu PC con `ipconfig` (línea **Dirección IPv4**) y entrá desde el celular a:

```
http://TU_IP:4200/cliente/1
```

Si no abre, permití el puerto en el firewall de Windows (PowerShell como administrador):

```powershell
netsh advfirewall firewall add rule name="Angular 4200" dir=in action=allow protocol=TCP localport=4200
```

Si Angular responde `Invalid Host header`, agregá en `angular.json` (dentro de `serve → options`):

```json
"allowedHosts": ["TU_IP"]
```

---

## 🧭 Rutas

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/cliente/:mesaId` | Carta y armado del pedido | Libre (QR) |
| `/cliente/:mesaId/cuenta` | Cuenta de la mesa | Libre (QR) |
| `/mozo/login` | Login del mozo | Libre |
| `/mozo` | Mesas y pedidos | Rol `mozo` |
| `/cocina/login` | Login de cocina | Libre |
| `/cocina` | Comandas | Rol `cocina` |

### 🔑 Usuarios de prueba (login simulado)

| Rol | Usuario | Contraseña |
|---|---|---|
| Mozo | `mozo` | `1234` |
| Cocina | `cocina` | `1234` |

> ⚠️ Son credenciales de **desarrollo**. Cuando se conecte el backend se reemplazan por autenticación real contra la base de datos.

---

## 📁 Estructura del proyecto

```
Frontend/src/app/
├── componentes/
│   ├── cliente/
│   │   ├── menu/            # Carta, carrito y envío de pedido
│   │   └── cuenta/          # Lo que va gastando la mesa
│   ├── mozo/
│   │   ├── login-mozo/
│   │   └── mesas/           # Mesas con sus pedidos
│   └── cocina/
│       ├── login-cocina/
│       └── comandas/        # Comandas pendientes y en preparación
├── guardias/                # autenticacion.guard, rol.guard
├── interceptores/           # autenticacion.interceptor (agrega el token)
├── modelos/                 # producto, pedido, mesa, usuario
└── servicios/               # menu, pedido, mesa, autenticacion
```

### Seguridad en el front

- **Guardias:** `autenticacionGuard` verifica que haya sesión y `rolGuard` que el rol sea el correcto (un mozo no entra a `/cocina`).
- **Interceptor:** agrega el header `Authorization: Bearer <token>` a cada petición HTTP.
- El cliente por QR **no usa** guardias ni interceptor.

> Los guardias solo protegen la interfaz. La seguridad real la va a dar el backend validando el token en cada endpoint.

---

## 📌 Estado actual

- [x] Estructura del proyecto y rutas
- [x] Modelos e interfaces
- [x] Login de mozo y cocina (simulado) con guardias e interceptor
- [x] Cliente: carta, carrito, envío de pedido y cuenta
- [x] Mozo: vista de mesas y entrega de pedidos
- [x] Cocina: comandas con cambio de estado
- [ ] Backend Express
- [ ] Base de datos SQL
- [ ] Autenticación real con tokens
- [ ] Generación de QR por mesa
- [ ] Gestión de stock desde cocina (marcar agotado)

### ⚠️ Limitación actual

Por ahora los datos viven **en memoria del navegador** (servicios con `BehaviorSubject`). Esto implica que:

- Al recargar la página (`F5`) se pierden los pedidos.
- Cada pestaña o dispositivo tiene su propio estado: lo que pide el celular no lo ve la cocina.
- Hay que navegar con los links de la app, sin escribir la URL a mano, para conservar el estado.

Esto se resuelve al conectar el backend y la base de datos: solo cambian los métodos internos de los servicios, los componentes no se modifican.

---

## 🗺️ Roadmap

1. **Backend Express** con API REST (productos, pedidos, mesas, usuarios).
2. **Base de datos SQL** a partir del DER del proyecto.
3. **Autenticación real** (login con token) para mozo y cocina.
4. **Sincronización entre dispositivos** (cliente, mozo y cocina viendo los mismos datos).
5. **QR por mesa** apuntando a `/cliente/:mesaId`.

---

## 📚 Documentación del proyecto

El proyecto incluye, entre otros, los siguientes diagramas:

- Diagramas de Flujo de Datos (DFD): nivel 0, 1 y 2 (mozo y cocina)
- Diagrama Entidad-Relación (DER) conceptual
- Diagrama de Transición de Estados (estados del pedido)

---

## 👤 Autor

**Agustín Lanthier**
Proyecto final de carrera.