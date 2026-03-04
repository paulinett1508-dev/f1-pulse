# Setup da VPS Hostinger — Guia Completo

## Pré-requisitos na VPS

```bash
# Instalar Docker + Docker Compose (se ainda não tiver)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Relogue após adicionar ao grupo docker
```

---

## 1. Criar a rede compartilhada (uma vez só)

```bash
docker network create proxy
```

Todos os projetos e o Traefik se comunicam por essa rede.

---

## 2. Deploy do Traefik (uma vez só)

```bash
# Criar diretório do Traefik
sudo mkdir -p /opt/traefik/dynamic
sudo mkdir -p /var/log/traefik

# Copiar os arquivos deste repo
sudo cp infra/traefik/docker-compose.yml /opt/traefik/
sudo cp infra/traefik/traefik.yml /opt/traefik/
sudo cp infra/traefik/dynamic/security-headers.yml /opt/traefik/dynamic/

# Criar arquivo de certificados SSL (permissão restrita obrigatória)
sudo touch /opt/traefik/acme.json
sudo chmod 600 /opt/traefik/acme.json
```

### Configurar antes de subir:

1. **Email para Let's Encrypt** — edite `/opt/traefik/traefik.yml`:
   ```yaml
   email: seu-email-real@dominio.com
   ```

2. **Senha do Dashboard** — edite `/opt/traefik/docker-compose.yml`:
   ```bash
   # Gere o hash da senha:
   sudo apt install apache2-utils -y
   htpasswd -nB admin
   # Cole o resultado na label basicauth.users (duplique os $ → $$)
   ```

3. **Domínio do Dashboard** — troque `traefik.seudominio.com` pelo seu subdomínio real.

### Subir o Traefik:

```bash
cd /opt/traefik
docker compose up -d
docker compose logs -f  # verificar se subiu OK
```

---

## 3. Deploy do F1 Pulse

```bash
# Clonar o projeto (ou git pull se já existir)
cd /opt
git clone <url-do-repo> f1-pulse
cd f1-pulse

# Editar o subdomínio no docker-compose.yml
# Trocar f1.seudominio.com pelo domínio real

# Build e subir
docker compose up -d --build

# Verificar
docker compose logs -f
```

### Para atualizar:

```bash
cd /opt/f1-pulse
git pull
docker compose up -d --build
```

---

## 4. Adicionando novos projetos (template)

Cada novo projeto precisa **apenas** de um `docker-compose.yml` com estas labels:

```yaml
services:
  meu-projeto:
    build: .
    container_name: meu-projeto
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.meu-projeto.rule=Host(`meu-projeto.seudominio.com`)"
      - "traefik.http.routers.meu-projeto.entrypoints=websecure"
      - "traefik.http.routers.meu-projeto.tls.certresolver=letsencrypt"
      - "traefik.http.routers.meu-projeto.middlewares=security-headers@file"
      - "traefik.http.services.meu-projeto.loadbalancer.server.port=PORTA_INTERNA"
    networks:
      - proxy

networks:
  proxy:
    external: true
```

Basta trocar:
- `meu-projeto` → nome do projeto
- `meu-projeto.seudominio.com` → subdomínio desejado
- `PORTA_INTERNA` → porta que o container expõe (80, 3000, 8000, etc)

O Traefik detecta automaticamente, gera SSL, e roteia o tráfego.

---

## 5. DNS

Para cada subdomínio, criar um registro **A** no painel de DNS apontando para o IP da VPS:

| Tipo | Nome | Valor |
|------|------|-------|
| A | f1 | IP_DA_VPS |
| A | api | IP_DA_VPS |
| A | app | IP_DA_VPS |
| A | traefik | IP_DA_VPS |

Ou usar um wildcard: `*.seudominio.com → IP_DA_VPS`

---

## Estrutura final na VPS

```
/opt/
├── traefik/                    ← Reverse proxy global
│   ├── docker-compose.yml
│   ├── traefik.yml
│   ├── acme.json               ← Certificados SSL (auto-gerados)
│   └── dynamic/
│       └── security-headers.yml
│
├── f1-pulse/                   ← Projeto 1 (SPA React)
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── ...
│
├── projeto-api/                ← Projeto 2 (Node/Python/Go/etc)
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── ...
│
└── projeto-n/                  ← Projeto N
    └── ...
```

---

## Comandos úteis

```bash
# Ver todos os containers rodando
docker ps

# Ver logs de um projeto
docker compose -f /opt/f1-pulse/docker-compose.yml logs -f

# Rebuild de um projeto específico
cd /opt/f1-pulse && docker compose up -d --build

# Ver rotas que o Traefik detectou
# Acesse https://traefik.seudominio.com (com login)

# Limpar imagens antigas (liberar espaço)
docker image prune -a
```
