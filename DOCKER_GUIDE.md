# Guía de Docker para tu Proyecto Frontend

¡Hola! Veo que has creado los archivos `Dockerfile` y `docker-compose.yml`. Aquí te explico qué hacen y qué código debes poner en ellos para que tu aplicación funcione.

## 1. ¿Qué es Docker?

Imagina que Docker es una forma de empaquetar tu aplicación junto con todo lo que necesita para funcionar (Node.js, dependencias, configuración) en una "caja" llamada **contenedor**. Esto asegura que si funciona en tu máquina, funcionará en cualquier otra parte.

## 2. El `Dockerfile` (frontend/Dockerfile)

El `Dockerfile` es la "copia seguridad" (receta) para crear esa caja. Le dice a Docker cómo levantar la aplicación.

**Copia y pega esto en tu archivo `frontend/Dockerfile`:**

```dockerfile
# 1. Usar una imagen base de Node.js (versión ligera 'alpine')
FROM node:18-alpine

# 2. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar los archivos de definición de dependencias primero
COPY package.json package-lock.json ./

# 4. Instalar las dependencias del proyecto
RUN npm install

# 5. Copiar el resto del código de la aplicación
COPY . .

# 6. Exponer el puerto que usa Vite (por defecto 5173)
EXPOSE 5173

# 7. Comando para iniciar la aplicación en modo desarrollo
# --host es necesario para que sea accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]
```

## 3. El `docker-compose.yml`

Docker Compose es una herramienta para definir y ejecutar aplicaciones multi-contenedor. Aunque solo tengas un servicio ahora (el frontend), facilita mucho los comandos.

**Copia y pega esto en tu archivo `docker-compose.yml` (en la raíz del proyecto):**

```yaml
version: '3.8'

services:
  frontend:
    # Construir usando el Dockerfile en la carpeta ./frontend
    build: 
      context: ./frontend
    
    # Nombre del contenedor para identificarlo fácilmente
    container_name: iteria-frontend
    
    # Mapeo de puertos: "Puerto-PC:Puerto-Contenedor"
    ports:
      - "5173:5173"
    
    # Volúmenes para "Hot Reload" (cambios en vivo)
    volumes:
      - ./frontend:/app
      - /app/node_modules # Truco: Evita que se mezclen node_modules locales y del contenedor
```

## 4. Cómo ejecutarlo

1.  Abre tu terminal en la carpeta raíz (donde está `docker-compose.yml`).
2.  Ejecuta:

    ```bash
    docker-compose up --build
    ```

3.  Abre tu navegador en: **http://localhost:5173**

## 5. Comandos útiles

*   `docker-compose down`: Detiene y elimina los contenedores.
*   `docker-compose up -d`: Inicia en segundo plano (sin bloquear la terminal).

## 6. ¿Para qué sirve esto en la vida real?

### Escenario 1: Trabajo en Equipo
Imagina que llega un nuevo programador a tu equipo.
*   **Sin Docker:** Tendría que instalar Node.js, configurar versiones, averiguar por qué su Windows es diferente al tuyo... un dolor de cabeza.
*   **Con Docker:**
    1. Descarga tu código.
    2. Ejecuta `docker-compose up`.
    3. **¡Listo!** Ya tiene la aplicación funcionando idéntica a la tuya.

### Escenario 2: Subir a Internet (Deploy)
Cuando quieras publicar tu página en un servidor real:
1.  Copias la carpeta de tu proyecto al servidor.
2.  Ejecutas `docker-compose up -d` (el `-d` es para que corra "detrás de cámaras").
3.  Tu web ya está online y se reiniciará sola si el servidor se apaga.
