# Usar una imagen estándar de Node.js (Debian) versión 20 (Requerida por Supabase)
FROM node:20

# Establecer la carpeta de trabajo dentro del 'contenedor'
WORKDIR /app

# Copiar primero los archivos de dependencias (para optimizar la caché)
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto donde corre la aplicación (Vite usa 5173 por defecto)
EXPOSE 5173

# Arrancar la aplicación en modo desarrollo, accesible desde fuera (--host)
CMD ["npm", "run", "dev", "--", "--host"]