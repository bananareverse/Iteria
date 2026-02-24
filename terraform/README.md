# Iteria — Infraestructura AWS

> Gestor de proyectos ágil para estudiantes y profesionales.

---

## Stack de infraestructura

| Capa | Tecnología |
|---|---|
| Servidor | AWS EC2 t3.micro (Ubuntu 22.04) |
| Red | AWS VPC (subnets públicas y privadas) |
| Base de datos | AWS RDS PostgreSQL 15 |
| Almacenamiento | AWS S3 |
| IP fija | AWS Elastic IP |
| Contenedores | Docker + Docker Compose |
| IaC | Terraform |
| Auth & DB app | Supabase |

---

## Pre-requisitos

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.5
- [AWS CLI v2](https://awscli.amazonaws.com/AWSCLIV2.msi)
- [Git](https://git-scm.com/)
- Cuenta de AWS
- Proyecto en [Supabase](https://supabase.com)

---

## Levantar la infraestructura

### 1. Configurar AWS

```powershell
aws configure
```

```
AWS Access Key ID:     TU_ACCESS_KEY
AWS Secret Access Key: TU_SECRET_KEY
Default region:        us-east-1
Output format:         json
```

### 2. Crear Key Pair

```powershell
New-Item -ItemType Directory -Force -Path "$HOME\.ssh"

aws ec2 create-key-pair `
  --key-name iteria-key `
  --query "KeyMaterial" `
  --output text | Out-File -Encoding ascii "$HOME\.ssh\iteria-key.pem"
```

### 3. Clonar y configurar

```powershell
git clone https://github.com/bananareverse/Iteria.git
cd Iteria/iteria-terraform
copy terraform.tfvars.example terraform.tfvars
```

Edita `terraform.tfvars` con tus valores:

```hcl
ec2_key_name     = "iteria-key"
db_password      = "TuPasswordSegura123!"
allowed_ssh_cidr = "0.0.0.0/0"
```

### 4. Desplegar

```powershell
terraform init
terraform plan
terraform apply   # escribe: yes
```

Al terminar (~10 min) obtienes:

```
ec2_public_ip  = "XX.XX.XX.XX"
s3_bucket_name = "iteria-prod-assets-XXXXXXXX"
ssh_connection = "ssh -i ~/.ssh/iteria-key.pem ubuntu@XX.XX.XX.XX"
```

---

## Configurar el servidor

### 1. Conectarse

```powershell
ssh -i "$HOME\.ssh\iteria-key.pem" ubuntu@XX.XX.XX.XX
```

### 2. Instalar Docker

```bash
sudo snap install docker
sudo usermod -aG docker ubuntu
newgrp docker
```

### 3. Clonar el repositorio

```bash
cd /home/ubuntu/iteria
git clone https://github.com/bananareverse/Iteria.git .
```

### 4. Configurar Supabase

Obtén tus credenciales en Supabase → Settings → API Keys

```bash
nano /home/ubuntu/iteria/frontend/.env
```

```env
VITE_SUPABASE_URL=https://TUPROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_TUCLAVE
```

### 5. Crear docker-compose.yml

```bash
cat > /home/ubuntu/iteria/docker-compose.yml << 'EOF'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - VITE_SUPABASE_URL=https://TUPROYECTO.supabase.co
        - VITE_SUPABASE_ANON_KEY=sb_publishable_TUCLAVE
    ports:
      - "80:5173"
    restart: unless-stopped
EOF
```

### 6. Levantar

```bash
docker compose up -d --build
docker ps
```

Abre en el navegador: `http://XX.XX.XX.XX`

---

## Comandos útiles

```bash
# Ver contenedores
docker ps

# Ver logs
docker logs iteria-frontend-1 -f

# Reiniciar
docker compose restart

# Detener
docker compose down
```

### Actualizar cuando hay cambios en el código

```bash
cd /home/ubuntu/iteria
git pull origin main
docker compose down
docker compose up -d --build
```

---

## Destruir la infraestructura

> ⚠️ Esto borra todo en AWS sin posibilidad de recuperación.

Primero desactiva la protección del RDS en `modules/rds/main.tf`:

```hcl
deletion_protection = false
```

Luego:

```powershell
terraform apply -auto-approve
terraform destroy
```

---

## Costos estimados

| Recurso | Costo mensual |
|---|---|
| EC2 t3.micro | ~$8.50 (gratis 1er año) |
| RDS db.t3.micro | ~$13 (gratis 1er año) |
| S3 | ~$0.02/GB |
| Elastic IP | Gratis mientras esté asociada |
| **Total** | **~$22/mes** |

---

## Variables de entorno

| Variable | Dónde obtenerla |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → General |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API Keys |
| `AWS_ACCESS_KEY_ID` | AWS Console → IAM → Security Credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS Console → IAM → Security Credentials |
