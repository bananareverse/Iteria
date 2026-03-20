# 🚀 Guía Completa de Kubernetes para Iteria

## Descripción General

Esta guía te ayudará a desplegar la aplicación Iteria en un cluster de Kubernetes. La configuración incluye:

- **Namespace** para aislamiento de recursos
- **Deployment** con replicas y actualizaciones automáticas
- **Service** para exponer la aplicación
- **Ingress** para enrutamiento HTTP/HTTPS
- **HPA** (Horizontal Pod Autoscaler) para escalado automático
- **Network Policies** para seguridad
- **Resource Quotas** para límites de recursos

---

##  Requisitos Previos

1. **Kubernetes Cluster** (v1.24+)
   - Minikube para desarrollo local
   - EKS en AWS para producción
   - Kind, Docker Desktop, o cualquier otro

2. **kubectl** instalado y configurado
   ```bash
   kubectl version --client
   ```

3. **Docker** para construir imágenes
   ```bash
   docker --version
   ```

4. **Nginx Ingress Controller** (opcional pero recomendado)
   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml
   ```

---

##  Estructura de Archivos

```
k8s/
├── namespace.yaml              # Namespace para Iteria
├── frontend-config.yaml        # ConfigMap con variables de entorno
├── frontend-deployment.yaml    # Deployment del frontend
├── frontend-service.yaml       # Service clusterIP
├── frontend-ingress.yaml       # Ingress para acceso externo
├── frontend-hpa.yaml          # Escalado automático
├── network-policy.yaml        # Políticas de red
├── resource-quota.yaml        # Límites de recursos
└── KUBERNETES_GUIDE.md        # Esta guía
```

---

## Instalación Paso a Paso

### 1 Crear el Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

Verificar:
```bash
kubectl get namespaces
kubectl describe namespace iteria
```

---

### 2 Construir la Imagen Docker

#### Opción A: Localmente (para Minikube)

```bash
# Asegurate de estar en el contexto de Minikube
eval $(minikube docker-env)

# Construir la imagen
docker build -t iteria-frontend:latest ./frontend
```

#### Opción B: Registrar en Docker Hub / ECR

```bash
# Docker Hub
docker build -t tu_usuario/iteria-frontend:latest ./frontend
docker push tu_usuario/iteria-frontend:latest

# AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker build -t 123456789.dkr.ecr.us-east-1.amazonaws.com/iteria-frontend:latest ./frontend
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/iteria-frontend:latest
```

---

### 3 Actualizar ConfigMap

Edita `k8s/frontend-config.yaml` con tus valores:

```yaml
data:
  VITE_SUPABASE_URL: "tu_url_supabase"
  VITE_SUPABASE_ANON_KEY: "tu_key_supabase"
  NODE_ENV: "production"
  VITE_API_URL: "https://api.iteria.local"
```

---

### 4 Desplegar ConfigMap

```bash
kubectl apply -f k8s/frontend-config.yaml
```

Verificar:
```bash
kubectl describe configmap frontend-config -n iteria
```

---

### 5 Desplegar Deployment

```bash
kubectl apply -f k8s/frontend-deployment.yaml
```

Monitorear el despliegue:
```bash
kubectl rollout status deployment/iteria-frontend -n iteria
kubectl get pods -n iteria -w
```

---

### 6 Desplegar Service

```bash
kubectl apply -f k8s/frontend-service.yaml
```

Verificar:
```bash
kubectl get svc -n iteria
kubectl describe service iteria-frontend -n iteria
```

---

### 7 Desplegar Ingress (Opcional)

Primero instala **cert-manager** (para HTTPS automático):

```bash
# Instalar cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Esperar a que este listo
kubectl rollout status deployment/cert-manager -n cert-manager

# Crear ClusterIssuer para Let's Encrypt
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: tu_email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

Luego desplegar Ingress:

```bash
kubectl apply -f k8s/frontend-ingress.yaml
```

Verificar:
```bash
kubectl get ingress -n iteria
kubectl describe ingress iteria-ingress -n iteria
```

---

### 8 Desplegar HPA (Escalado Automático)

```bash
kubectl apply -f k8s/frontend-hpa.yaml
```

Verificar:
```bash
kubectl get hpa -n iteria
kubectl describe hpa iteria-frontend-hpa -n iteria
```

**Nota:** Para que funcione, necesitas **Metrics Server**:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

---

### 9 Desplegar Network Policy

```bash
kubectl apply -f k8s/network-policy.yaml
```

Verificar:
```bash
kubectl get networkpolicies -n iteria
```

---

### 10 Desplegar Resource Quota

```bash
kubectl apply -f k8s/resource-quota.yaml
```

Verificar:
```bash
kubectl describe resourcequota iteria-quota -n iteria
```

---

##  Comandos Útiles para Monitoreo

### Ver todos los recursos en el namespace

```bash
kubectl get all -n iteria
```

### Ver logs de la aplicación

```bash
# Último pod
kubectl logs -n iteria -l app=iteria-frontend --tail=50 -f

# Pod específico
kubectl logs -n iteria pod/iteria-frontend-xxxxx -f
```

### Ejecutar comandos dentro de un pod

```bash
kubectl exec -it -n iteria pod/iteria-frontend-xxxxx -- /bin/sh
```

### Port forward local

```bash
kubectl port-forward -n iteria svc/iteria-frontend 5173:80
```

Luego accede a `http://localhost:5173`

### Ver eventos del cluster

```bash
kubectl get events -n iteria --sort-by='.lastTimestamp'
```

### Describir recursos

```bash
kubectl describe pod -n iteria pod/iteria-frontend-xxxxx
kubectl describe deployment -n iteria iteria-frontend
```

---

##  Despliegue Completo Automático

Crea un script `deploy.sh`:

```bash
#!/bin/bash

echo " Iniciando despliegue de Iteria en Kubernetes..."

# 1. Crear namespace
echo "1  Creando namespace..."
kubectl apply -f k8s/namespace.yaml

# 2. Desplegar ConfigMap
echo "2  Desplegando ConfigMap..."
kubectl apply -f k8s/frontend-config.yaml

# 3. Desplegar Deployment
echo "3  Desplegando Deployment..."
kubectl apply -f k8s/frontend-deployment.yaml

# 4. Desplegar Service
echo "4  Desplegando Service..."
kubectl apply -f k8s/frontend-service.yaml

# 5. Desplegar Network Policy
echo "5  Desplegando Network Policy..."
kubectl apply -f k8s/network-policy.yaml

# 6. Desplegar Resource Quota
echo "6  Desplegando Resource Quota..."
kubectl apply -f k8s/resource-quota.yaml

# 7. Desplegar HPA
echo "7  Desplegando HPA..."
kubectl apply -f k8s/frontend-hpa.yaml

# 8. Desplegar Ingress (si existe)
if [ -f "k8s/frontend-ingress.yaml" ]; then
  echo "8  Desplegando Ingress..."
  kubectl apply -f k8s/frontend-ingress.yaml
fi

echo ""
echo " Despliegue completado!"
echo ""
echo "Monitorear con:"
echo "  kubectl get all -n iteria"
echo "  kubectl logs -n iteria -l app=iteria-frontend -f"
```

Permisos y ejecución:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

##  Configuración de DNS Local

### Para Minikube

```bash
# Obtener IP de Minikube
minikube ip

# Agregar a /etc/hosts (Linux/Mac) o C:\Windows\System32\drivers\etc\hosts (Windows)
<minikube-ip> iteria.local
<minikube-ip> www.iteria.local
```

Luego accede a `http://iteria.local`

---

##  Actualizar la Aplicación

### Rolling Update (sin downtime)

```bash
# Opción 1: Cambiando la imagen
kubectl set image deployment/iteria-frontend \
  iteria-frontend=iteria-frontend:v2 \
  -n iteria

# Opción 2: Re-desplegando
kubectl rollout restart deployment/iteria-frontend -n iteria

# Ver estado del rollout
kubectl rollout status deployment/iteria-frontend -n iteria

# Revertir si algo sale mal
kubectl rollout undo deployment/iteria-frontend -n iteria
```

---

##  Limpiar Recursos

### Eliminar todo

```bash
kubectl delete namespace iteria
```

### Eliminar recursos específicos

```bash
kubectl delete deployment iteria-frontend -n iteria
kubectl delete service iteria-frontend -n iteria
kubectl delete ingress iteria-ingress -n iteria
```

---

##  Escenarios de Producción (AWS EKS)

Para desplegar en AWS EKS, necesitas:

1. **EKS Cluster** (puedes usar Terraform de tu carpeta `terraform/`)

2. **IAM roles y policies**

3. **Load Balancer** (AWS NLB/ALB)

4. **RDS** para base de datos (ya lo tienes en Terraform)

5. **Actualizar el Deployment** para usar ECR:

```yaml
image: 123456789.dkr.ecr.us-east-1.amazonaws.com/iteria-frontend:latest
imagePullSecrets:
- name: ecr-credentials
```

---

##  Troubleshooting

### Pods no inician

```bash
kubectl describe pod -n iteria pod/iteria-frontend-xxxxx
kubectl logs -n iteria pod/iteria-frontend-xxxxx
```

### Image pull errors

```bash
# Verificar si la imagen existe
docker images | grep iteria-frontend

# Para Minikube
eval $(minikube docker-env)
docker build -t iteria-frontend:latest ./frontend
```

### Service no accesible

```bash
kubectl port-forward -n iteria svc/iteria-frontend 5173:80
```

### Ingress no funciona

```bash
# Verificar Nginx Ingress Controller
kubectl get pods -n ingress-nginx

# Ver logs del Ingress
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

---

##  Próximos Pasos

1.  Completar esta configuración
2.  Integrar con Terraform para crearCluster EKS
3.  Agregar backend dedicado (si es necesario)
4.  Configurar CI/CD con GitHub Actions
5.  Agregar monitoreo con Prometheus/Grafana
6.  Configurar Backup y Disaster Recovery

---

##  Recursos Adicionales

- [Kubernetes Docs](https://kubernetes.io/docs/)
- [NGINX Ingress](https://kubernetes.github.io/ingress-nginx/)
- [Cert-Manager](https://cert-manager.io/)
- [AWS EKS](https://aws.amazon.com/eks/)

---

**Última actualización:** 26 de Febrero de 2026

¡Éxito con tu despliegue de Iteria en Kubernetes! 
