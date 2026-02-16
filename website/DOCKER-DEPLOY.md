# Docker Deployment for AI Mantras Website

Deploy the AI Mantras website on a Docker container with Cloudflare Tunnel for public access.

## Prerequisites

- Docker and Docker Compose installed on your LXC/server
- Cloudflare account with your domain (aimantras.org)
- cloudflared installed on the host

## 1. Build and Run the Container

```bash
# Clone the repo (or copy the website folder)
cd /opt/aimantras  # or wherever you want to deploy

# Build and start
docker compose up -d --build

# Verify it's running
curl http://localhost:8080
```

## 2. Set Up Cloudflare Tunnel (CLI-managed)

### Install cloudflared

```bash
# Debian/Ubuntu
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Or with apt (if cloudflare repo is configured)
# sudo apt install cloudflared
```

### Authenticate and Create Tunnel

```bash
# This opens a browser to authenticate with Cloudflare
cloudflared tunnel login

# Create a tunnel (choose a name)
cloudflared tunnel create aimantras

# Note the tunnel ID shown (e.g., a1b2c3d4-...)
```

### Configure the Tunnel

Create `/root/.cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: aimantras.org
    service: http://localhost:8080
  - hostname: www.aimantras.org
    service: http://localhost:8080
  - service: http_status:404
```

### Create DNS Records

```bash
# This creates a CNAME record pointing to your tunnel
cloudflared tunnel route dns aimantras aimantras.org
cloudflared tunnel route dns aimantras www.aimantras.org
```

### Install as System Service

```bash
# Install the service
sudo cloudflared service install

# Start it
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared
```

## 3. Verify Deployment

```bash
# Check tunnel is connected
cloudflared tunnel info aimantras

# Test the site
curl https://aimantras.org
```

## Updating the Site

```bash
cd /opt/aimantras/website
git pull
docker compose up -d --build
```

## Troubleshooting

### Check container logs
```bash
docker logs aimantras-web
```

### Check tunnel logs
```bash
sudo journalctl -u cloudflared -f
```

### Rebuild without cache
```bash
docker compose build --no-cache
docker compose up -d
```
