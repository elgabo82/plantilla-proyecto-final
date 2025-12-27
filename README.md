### plantilla-proyecto-final
* Proyecto de ejemplo sencillo y simple
# Tecnologías usadas en el Backend
* Node.js
# Módulos
* cors 2.8.5
* dotenv 17.2.3
* express 5.2.1
* mariadb 3.4.5
* morgan 1.10.1
* mysql2 3.16.0
* sequelize 6.37.7
# Tecnologías usadas en el Frontend
* HTML/CSS/Javascript

# Base de datos - MariaDB
* Servidor: grupofmo.com
  
### Cómo usar el Proyecto
* Clonar el repositorio
```
git clone https://github.com/elgabo82/plantilla-proyecto-final.git
```
* Crear una rama localmente
* Instalar todos los paquetes necesarios
```
npm i
```
* Ejecutar el Backend y Frontend, para este ejemplo están separados, pero es posible hacerlos escuchar en el mismo puerto

# Para ejecutar el backend
* Debe ejecutar el backend, se debe estar dentro del directorio del backend
* Puerto de la configuración: 8080
```
nodemon server.js
```

# Para ejecutar el Frontend
* Pueden instalar el módulo http-server
```
npm i http-server
```
* Puerto de la configuración: 8081
* Para ejecutar el Frontend, se debe estar dentro el directorio del frontend
```
http-server
```