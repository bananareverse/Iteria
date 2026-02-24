Iteria — Infraestructura AWS

Gestor de proyectos ágil para estudiantes y profesionales.


Stack de infraestructura
CapaTecnologíaServidorAWS EC2 t3.micro (Ubuntu 22.04)RedAWS VPC (subnets públicas y privadas)Base de datosAWS RDS PostgreSQL 15AlmacenamientoAWS S3IP fijaAWS Elastic IPContenedoresDocker + Docker ComposeIaCTerraformAuth & DB appSupabase

Pre-requisitos

Terraform >= 1.5
AWS CLI v2
Git
Cuenta de AWS
Proyecto en Supabase


Levantar la infraestructura
1. Configurar AWS
powershellaws configure
AWS Access Key ID:     TU_ACCESS_KEY
AWS Secret Access Key: TU_SECRET_KEY
Default region:        us-east-1
Output format:         json
2. Crear Key Pair
powershellNew-Item -ItemType Directory -Force -Path "$HOME\.ssh"

aws ec2 create-key-pair `
  --key-name iteria-key `
  --query "KeyMaterial" `
  --output text | Out-File -Encoding ascii "$HOME\.ssh\iteria-key.pem"
3. Clonar y configurar
powershellgit clone https://github.com/bananareverse/Iteria.git
cd Iteria/iteria-terraform
copy terraform.tfvars.example terraform.tfvars
Edita terraform.tfvars con tus valores:
hclec2_key_name     = "iteria-key"
db_password      = "TuPasswordSegura123!"
allowed_ssh_cidr = "0.0.0.0/0"
4. Desplegar
powershellterraform init
terraform plan
terraform apply   # escribe: yes
Al terminar (~10 min) obtienes:
ec2_public_ip  = "XX.XX.XX.XX"
s3_bucket_name = "iteria-prod-assets-XXXXXXXX"
ssh_connection = "ssh -i ~/.ssh/iteria-key.pem ubuntu@XX.XX.XX.XX"

Configurar el servidor
1. Conectarse
powershellssh -i "$HOME\.ssh\iteria-key.pem" ubuntu@XX.XX.XX.XX
2. Instalar Docker
bashsudo snap install docker
sudo usermod -aG docker ubuntu
newgrp docker
3. Clonar el repositorio
bashcd /home/ubuntu/iteria
git clone https://github.com/bananareverse/Iteria.git .
4. Configurar Supabase
Obtén tus credenciales en Supabase → Settings → API Keys
bashnano /home/ubuntu/iteria/frontend/.env
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
6. Levantar
bashdocker compose up -d --build
docker ps
Abre en el navegador: http://XX.XX.XX.XX

Comandos útiles
bash# Ver contenedores
docker ps

# Ver logs
docker logs iteria-frontend-1 -f

# Reiniciar
docker compose restart

# Detener
docker compose down
Actualizar cuando hay cambios en el código
bashcd /home/ubuntu/iteria
git pull origin main
docker compose down
docker compose up -d --build

Destruir la infraestructura

⚠️ Esto borra todo en AWS sin posibilidad de recuperación.

Primero desactiva la protección del RDS en modules/rds/main.tf:
hcldeletion_protection = false
Luego:
powershellterraform apply -auto-approve
terraform destroy

Costos estimados
RecursoCosto mensualEC2 t3.micro~$8.50 (gratis 1er año)RDS db.t3.micro~$13 (gratis 1er año)S3~$0.02/GBElastic IPGratis mientras esté asociadaTotal~$22/mes

Variables de entorno
VariableDónde obtenerlaVITE_SUPABASE_URLSupabase → Settings → GeneralVITE_SUPABASE_ANON_KEYSupabase → Settings → API KeysAWS_ACCESS_KEY_IDAWS Console → IAM → Security CredentialsAWS_SECRET_ACCESS_KEYAWS Console → IAM → Security Credentials
