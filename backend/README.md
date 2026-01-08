| Integrantes | Rol Principal |
| :--- | :--- |
| **ESPINOZA PILLASAGUA JIMER SAMUEL** | Lead Backend Developer & DB Admin |
| **CHAVEZ FLECHER MAURO YASMANI** | Lead Backend Developer & DB Admin |
| **MENDOZA PALMA BORIS SAMUEL** | Lead Backend Developer & DB Admin |
| **NAVARRETE BRIONES ISAAC ELIASIB** | Lead Backend Developer & DB Admin |
| **GILER MIELES JESUS ALFREDO** | Lead Backend Developer & DB Admin |

# 🎮 VR-Store Inventory API 🚀

![Backend Status](https://img.shields.io/badge/Backend-Running-brightgreen?style=for-the-badge&logo=node.js)
![Database](https://img.shields.io/badge/Database-Sequelize_SQLite-blue?style=for-the-badge&logo=sqlite)

Bienvenido al sistema de gestión de inventario para la tienda de **Realidad Virtual y Videojuegos**. Esta API permite controlar el stock, precios y categorías de dispositivos de última generación.

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
| :--- | :--- |
| **Node.js** | Entorno de ejecución |
| **Express** | Framework de servidor y rutas |
| **Sequelize** | ORM para manejo de Base de Datos |
| **CORS** | Intercambio de recursos de origen cruzado |
| **Dotenv** | Manejo de variables de entorno |

---

## ⚙️ Configuración e Instalación

### 1. Clonar y Preparar
```bash
# Navegar a tu rama de grupo
git checkout nombre-de-tu-grupo

# Instalar dependencias
npm install

### 📋 Estructura de Datos (JSON)
Cada objeto `Producto` en nuestra base de datos tiene la siguiente estructura:

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | Integer | Identificador único (Auto-incremental) |
| `nombre` | String | Nombre del producto (Obligatorio) |
| `cantidad` | Integer | Stock disponible (Default: 0) |
| `precio` | Float | Precio unitario (Obligatorio) |
| `categoria` | String | Categoría del producto |

---

### 🚀 Operaciones y Pruebas

#### 1. Listar Productos (READ)
* **Método:** `GET`
* **Endpoint:** `/api/v1/productos`
* **Acción:** Recupera todos los registros de la base de datos.
* **Prueba en PowerShell:**
    ```powershell
    Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/v1/productos"
    ```

#### 2. Crear Nuevo Registro (CREATE)
* **Método:** `POST`
* **Endpoint:** `/api/v1/productos`
* **Acción:** Inserta un nuevo producto. El servidor responde con el objeto creado y su ID.
* **Prueba en PowerShell:**
    ```powershell
    $postData = @{ nombre="Apple Vision Pro"; cantidad=2; precio=3499.00; categoria="Realidad Virtual" } | ConvertTo-Json
    Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/v1/productos" -ContentType "application/json" -Body $postData
    ```

#### 3. Actualizar Información (UPDATE)
* **Método:** `PUT`
* **Endpoint:** `/api/v1/productos/:id`
* **Acción:** Actualiza campos específicos de un producto existente.
* **Prueba en PowerShell:**
    ```powershell
    $updateData = @{ precio=449.99; cantidad=20 } | ConvertTo-Json
    Invoke-RestMethod -Method Put -Uri "http://localhost:8080/api/v1/productos/1" -ContentType "application/json" -Body $updateData
    ```

#### 4. Eliminar Registro (DELETE)
* **Método:** `DELETE`
* **Endpoint:** `/api/v1/productos/:id`
* **Acción:** Borra permanentemente el producto especificado por el ID.
* **Prueba en PowerShell:**
    ```powershell
    Invoke-RestMethod -Method Delete -Uri "http://localhost:8080/api/v1/productos/2"
    ```

---

### 🚥 Códigos de Estado HTTP
Nuestra API responde con los siguientes estados estándar para confirmar el éxito o error de la operación:



* ✅ **200 OK:** La solicitud fue exitosa.
* ✨ **201 Created:** El producto se creó correctamente.
* ❌ **400 Bad Request:** Los datos enviados son inválidos.
* 🔍 **404 Not Found:** El ID del producto no existe.
* ⚠️ **500 Internal Server Error:** Error inesperado en el servidor.

---