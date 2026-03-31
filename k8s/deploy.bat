@echo off
SETLOCAL EnableDelayedExpansion

echo  Iniciando despliegue de Iteria en Kubernetes...

:: 1. Crear namespace
echo [1/7] Creando namespace...
kubectl apply -f k8s/namespace.yaml

:: 2. Desplegar ConfigMap
echo [2/7] Desplegando ConfigMap...
kubectl apply -f k8s/frontend-config.yaml

:: 3. Desplegar Deployment
echo [3/7] Desplegando Deployment...
kubectl apply -f k8s/frontend-deployment.yaml

:: 4. Desplegar Service
echo [4/7] Desplegando Service...
kubectl apply -f k8s/frontend-service.yaml

:: 5. Desplegar Network Policy
echo [5/7] Desplegando Network Policy...
kubectl apply -f k8s/network-policy.yaml

:: 6. Desplegar Resource Quota
echo [6/7] Desplegando Resource Quota...
kubectl apply -f k8s/resource-quota.yaml

:: 7. Desplegar HPA
echo [7/7] Desplegando HPA...
kubectl apply -f k8s/frontend-hpa.yaml

echo.
echo  Despliegue completado!
echo.
echo Monitorear con:
echo   kubectl get all -n iteria
echo   kubectl logs -n iteria -l app=iteria-frontend -f
