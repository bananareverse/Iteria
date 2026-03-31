#!/bin/bash

# Script de despliegue para Iteria en Kubernetes
# Uso: ./deploy.sh [all|check|cleanup]

NAMESPACE="iteria"

echo -e "\033[1;32m 🚀 Iniciando despliegue de Iteria en Kubernetes...\033[0m"

# 1. Crear namespace
echo -e "\033[1;34m[1/7] Creando namespace...\033[0m"
kubectl apply -f k8s/namespace.yaml

# 2. Desplegar ConfigMap
echo -e "\033[1;34m[2/7] Desplegando ConfigMap...\033[0m"
kubectl apply -f k8s/frontend-config.yaml

# 3. Desplegar Deployment
echo -e "\033[1;34m[3/7] Desplegando Deployment...\033[0m"
kubectl apply -f k8s/frontend-deployment.yaml

# 4. Desplegar Service
echo -e "\033[1;34m[4/7] Desplegando Service...\033[0m"
kubectl apply -f k8s/frontend-service.yaml

# 5. Desplegar Network Policy
echo -e "\033[1;34m[5/7] Desplegando Network Policy...\033[0m"
kubectl apply -f k8s/network-policy.yaml

# 6. Desplegar Resource Quota
echo -e "\033[1;34m[6/7] Desplegando Resource Quota...\033[0m"
kubectl apply -f k8s/resource-quota.yaml

# 7. Desplegar HPA
echo -e "\033[1;34m[7/7] Desplegando HPA...\033[0m"
kubectl apply -f k8s/frontend-hpa.yaml

echo -e "\n\033[1;32m ✅ Despliegue completado!\033[0m"
echo -e "\nMonitorear con:"
echo -e "  kubectl get all -n $NAMESPACE"
echo -e "  kubectl logs -n $NAMESPACE -l app=iteria-frontend -f"
