# Dockerfile Optimizado para Kubernetes
# Usa Dockerfile.prod para producción en EKS

FROM node:20-alpine

WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 nodejs && \
    adduser -S nodejs -u 1001

# Copiar primero los archivos de dependencias
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Cambiar permisos
RUN chown -R nodejs:nodejs /app

# Cambiar de usuario
USER nodejs

# Exponer puerto
EXPOSE 5173

# Health check para Kubernetes
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5173', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Arrancar en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]