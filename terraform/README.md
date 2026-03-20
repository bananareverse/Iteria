🚀 Iteria — Infraestructura AWS con Terraform
Gestor de proyectos ágil para estudiantes y profesionales.
App en producción: http://34.234.18.46

📐 Resumen de la infraestructura
Lo que se construyó
ComponenteTecnologíaDetalleFrontendReact + Vite + Tailwind CSSCorre en Docker en EC2Base de datosSupabase (PostgreSQL)Backend as a ServiceServidorAWS EC2 t3.microUbuntu 22.04 + DockerRedAWS VPCSubnets públicas y privadasBase de datos AWSAWS RDS PostgreSQL 15Subnet privada, encriptadoAlmacenamientoAWS S3Assets y uploadsIP fijaAWS Elastic IP34.234.18.46ContenedoresDocker + Docker ComposeFrontend containerizadoIaCTerraformToda la infra como código
Diagrama
Internet
   │
   ▼
[34.234.18.46] ──► [EC2 Ubuntu 22.04]
                        │
                        ├── Docker: React Frontend (puerto 80)
                        │       └── Conectado a Supabase (auth + db)
                        │
                        ├── [RDS PostgreSQL] (subnet privada)
                        └── [S3 Bucket] iteria-prod-assets-883b0739

✅ Pre-requisitos para levantar desde cero
1. Herramientas necesarias

Terraform >= 1.5
AWS CLI v2
VS Code
Git
Cuenta de AWS
Proyecto en Supabase

2. Instalar AWS CLI en Windows
Descarga el instalador desde https://awscli.amazonaws.com/AWSCLIV2.msi
Instala y cierra/abre VS Code para que tome efecto.
3. Instalar Terraform en Windows
Descarga desde https://developer.hashicorp.com/terraform/install → Windows AMD64
Extrae terraform.exe y muévelo a C:\Windows\System32\

⚙️ Configuración inicial
1. Configurar credenciales AWS
powershellaws configure
# AWS Access Key ID:     TU_ACCESS_KEY
# AWS Secret Access Key: TU_SECRET_KEY
# Default region:        us-east-1
# Output format:         json
Verifica:
powershellaws sts get-caller-identity
2. Crear Key Pair para SSH
powershellNew-Item -ItemType Directory -Force -Path "$HOME\.ssh"

aws ec2 create-key-pair --key-name iteria-key --query "KeyMaterial" --output text | Out-File -Encoding ascii -FilePath "$HOME\.ssh\iteria-key.pem"

🏗️ Levantar infraestructura con Terraform
1. Clonar el repositorio y abrir en VS Code
powershellgit clone https://github.com/bananareverse/Iteria.git
cd Iteria/iteria-terraform
code .
2. Crear archivo de variables
powershellcopy terraform.tfvars.example terraform.tfvars
Edita terraform.tfvars:
hclec2_key_name     = "iteria-key"
db_password      = "Password"
allowed_ssh_cidr = "0.0.0.0/0"
3. Inicializar y desplegar
powershellterraform init
terraform plan
terraform apply
# Escribe: yes
Espera 5-10 minutos. Al terminar verás:
ec2_public_ip  = "34.234.18.46"
s3_bucket_name = "iteria-prod-assets-883b0739"
ssh_connection = "ssh -i ~/.ssh/iteria-key.pem ubuntu@34.234.18.46"

🐳 Configurar y levantar el servidor
1. Conectarse al servidor EC2
powershellssh -i "$HOME\.ssh\iteria-key.pem" ubuntu@34.234.18.46
2. Instalar Docker (si no está instalado)
bashsudo snap install docker
sudo usermod -aG docker ubuntu
newgrp docker
3. Clonar el repositorio en el servidor
bashmkdir -p /home/ubuntu/iteria
cd /home/ubuntu/iteria
git clone https://github.com/bananareverse/Iteria.git .
4. Configurar variables de Supabase
Obtén tus credenciales en: https://supabase.com → tu proyecto → Settings → API Keys
bashnano /home/ubuntu/iteria/frontend/.env
Contenido del archivo:
envVITE_SUPABASE_URL=https://TUPROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_TUCLAVE
5. Crear docker-compose.yml
bashcat > /home/ubuntu/iteria/docker-compose.yml << 'EOF'
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
6. Levantar el contenedor
bashdocker compose up -d --build
Verifica que corre:
bashdocker ps
7. Abrir en el navegador
http://34.234.18.46

🔄 Actualizar el frontend (cuando haya cambios en el código)
bash# Conectarse al servidor
ssh -i "$HOME\.ssh\iteria-key.pem" ubuntu@34.234.18.46

# Actualizar código
cd /home/ubuntu/iteria
git pull origin main

# Reconstruir contenedor
docker compose down
docker compose up -d --build

🛑 Comandos útiles en el servidor
bash# Ver contenedores corriendo
docker ps

# Ver logs del frontend
docker logs iteria-frontend-1 -f

# Reiniciar contenedor
docker compose restart

# Detener todo
docker compose down

🗑️ Destruir la infraestructura AWS
powershell# ⚠️ CUIDADO: borra todo en AWS
# Primero deshabilita deletion_protection en modules/rds/main.tf:
# deletion_protection = false
# Luego aplica y destruye:
terraform apply
terraform destroy

💰 Costo estimado en AWS
RecursoCosto mensualEC2 t3.micro~$8.50 (gratis 1er año)RDS db.t3.micro~$13 (gratis 1er año)S3~$0.02/GBElastic IPGratis mientras esté en usoTotal~$22/mes

🔐 Variables de entorno necesarias
VariableDónde obtenerlaVITE_SUPABASE_URLSupabase → Settings → General → Project URLVITE_SUPABASE_ANON_KEYSupabase → Settings → API Keys → Publishable keyAWS_ACCESS_KEY_IDAWS Console → IAM → Security CredentialsAWS_SECRET_ACCESS_KEYAWS Console → IAM → Security Credentials

📁 Estructura del proyecto
Iteria/
├── frontend/                  # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/             # Páginas de la app
│   │   ├── lib/supabase.js    # Conexión a Supabase
│   │   └── App.jsx
│   ├── Dockerfile             # Imagen Docker del frontend
│   └── package.json
├── iteria-terraform/          # Infraestructura como código
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── modules/
│       ├── vpc/               # Red virtual AWS
│       ├── ec2/               # Servidor con Docker
│       ├── rds/               # PostgreSQL
│       └── s3/                # Almacenamiento
└── docker-compose.yml         # Orquestación de contenedores