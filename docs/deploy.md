# Production'ga çiqariş qöllanmasi

Bu hujjat `imlogram.uz` saytini va `@imlogram_bot`ni **haqiqiy serverga** (VPS) çiqarib,
doimiy işlaydigan qiliş uçun amaliy, boşdan-oxirigaça bosqiçma-bosqiç qöllanma.
Har bir buyruqni ketma-ket, özgartirmasdan köçirib qöysangiz işlab ketadi.

## 0. Kerakli narsalar

- **VPS server** — Ubuntu 22.04 LTS tavsiya etiladi (Hetzner, DigitalOcean, Timeweb va h.k.
  — qaysi birini tanlaşingiz farqi yöq, buyruqlar bir xil işlaydi). Minimal: 1 vCPU, 1GB RAM.
- **Domen** — `imlogram.uz`, DNS boşqaruviga kiriş huquqi (A-yozuv qöşiş uçun).
- Serverga **root yoki sudo** huquqi bilan SSH orqali kiriş.

## 1. Domenni serverga boğlaş (DNS)

Domen sotib olingan joyda (registrar panelida) quyidagi yozuvlarni qöşing:

| Turi | Nomi | Qiymati |
|---|---|---|
| A | `@` | server IP manzili |
| A | `www` | server IP manzili |

DNS tarqalişi odatda 5-30 daqiqa, ba'zan bir neça soat vaqt oladi. Tekşiriş:

```bash
dig +short imlogram.uz
```

Server IP manzilini körsatsa — tayyor, keyingi bosqiçga öting.

## 2. Serverni tayyorlaş

SSH orqali serverga kiring, söng:

```bash
# Tizimni yangilash
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS o'rnatish
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# pnpm o'rnatish
sudo npm install -g pnpm@9 pm2

# Nginx va Certbot (SSL uchun)
sudo apt install -y nginx certbot python3-certbot-nginx

# Build vaqtida better-sqlite3 (bot) uchun kerak bo'ladigan vositalar
sudo apt install -y python3 build-essential
```

Tekşiriş: `node -v` (v20.x), `pnpm -v`, `pm2 -v` — hammasi işlaşi kerak.

## 3. Kodni serverga olib keliş

```bash
cd /var/www
sudo mkdir -p imlogram && sudo chown $USER:$USER imlogram
git clone https://github.com/imlogram/imlogram.git imlogram
cd imlogram
pnpm install
```

## 4. Muhit özgaruvçilarini sozlaş

### Bot (`apps/bot/.env`)

```bash
cp apps/bot/.env.example apps/bot/.env
nano apps/bot/.env
```

Töldiring:

```
TELEGRAM_BOT_TOKEN=<@BotFather'dan olingan haqiqiy token>
FEEDBACK_CHANNEL_ID=<fikr-mulohaza kanali ID, masalan -100...>
FORCE_SUB_CHANNEL_ID=<majburiy a'zolik kanali ID>
FORCE_SUB_CHANNEL_USERNAME=imlogramuz
```

> **Xavfsizlik**: bu fayl `.gitignore`da, heç qaçon git'ga tuşmaydi. Serverda ham uni
> heç kimga körsatmang, `chmod 600 apps/bot/.env` bilan huquqini çeklaşingiz mumkin.

### Sayt (`apps/web`)

Hozirça maxsus muhit özgaruvçisi talab qilinmaydi (backend/API hali yöq). Kelajakda
kerak bölsa, `apps/web/.env.local` şu tarzda qöşiladi.

## 5. Build qiliş

```bash
cd /var/www/imlogram
pnpm --filter @imlogram/parser build
pnpm --filter @imlogram/core build
pnpm --filter @imlogram/web build
pnpm --filter @imlogram/bot build
```

## 6. Saytni işga tuşiriş (PM2 + Nginx)

### PM2 orqali Next.js serverini işga tuşiriş

```bash
cd /var/www/imlogram/apps/web
pm2 start "pnpm start" --name imlogram-web
```

Bu `next start`ni 3000-portda doimiy işlaydigan qilib qöyadi.

### Nginx — reverse proxy sozlaş

```bash
sudo nano /etc/nginx/sites-available/imlogram.uz
```

Quyidagini joylaştiring:

```nginx
server {
    listen 80;
    server_name imlogram.uz www.imlogram.uz;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Yoqiş va tekşiriş:

```bash
sudo ln -s /etc/nginx/sites-available/imlogram.uz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Şu bosqiçda `http://imlogram.uz` allaqaçon oçilişi kerak.

### SSL (HTTPS) — Certbot bilan bepul sertifikat

```bash
sudo certbot --nginx -d imlogram.uz -d www.imlogram.uz
```

Savol beriladi — email kiriting, şartlarga rozilik bering, "redirect HTTP to HTTPS"
variantini tanlang. Certbot avtomatik yangilanadi (cron/systemd timer orqali), qölda
heç narsa qiliş şart emas.

Endi `https://imlogram.uz` işlaydi.

## 7. Botni işga tuşiriş (doimiy, PM2 orqali)

```bash
cd /var/www/imlogram/apps/bot
pm2 start "node dist/index.js" --name imlogram-bot
```

Bot long-polling rejimida işlaydi — alohida domen yoki Nginx sozlamasi şart emas.

> **Diqqat**: bir vaqtning özida faqat **bitta** joyda şu tokenli bot işlaşi mumkin
> (Telegram çeklovi). Agar botni lokal kompyuteringizda ham işga tuşirgan bölsangiz,
> uni töxtating (`Ctrl+C`) — aks holda ikkalasi ham "Conflict" xatosi bilan töxtaydi.

## 8. Server qayta yoqilganda avtomatik işga tuşişi

```bash
pm2 save
pm2 startup
```

`pm2 startup` çiqargan buyruqni (bitta qator, `sudo` bilan boşlanadi) nusxalab, alohida
işga tuşiring — şu orqali server reboot bölsa ham `imlogram-web` va `imlogram-bot`
avtomatik qayta işga tuşadi.

## 9. Holatni tekşiriş

```bash
pm2 status          # ikkala jarayon ham "online" bo'lishi kerak
pm2 logs imlogram-web
pm2 logs imlogram-bot
```

Saytni tekşiring: `https://imlogram.uz`. Botni tekşiring: Telegram'da `@imlogram_bot`ga
`/start` yozing.

## 10. Yangilanişlarni serverga olib keliş

Kodda özgariş bölganda (GitHub'da yangi commit):

```bash
cd /var/www/imlogram
git pull
pnpm install
pnpm --filter @imlogram/parser build
pnpm --filter @imlogram/core build
pnpm --filter @imlogram/web build
pnpm --filter @imlogram/bot build
pm2 restart imlogram-web imlogram-bot
```

Bu ketma-ketlikni skript qilib saqlaş tavsiya etiladi (`deploy.sh`):

```bash
#!/usr/bin/env bash
set -e
cd /var/www/imlogram
git pull
pnpm install
pnpm --filter @imlogram/parser --filter @imlogram/core --filter @imlogram/web --filter @imlogram/bot build
pm2 restart imlogram-web imlogram-bot
echo "Deploy tugadi: $(date)"
```

## Muammolarni bartaraf qiliş

| Muammo | Yeçim |
|---|---|
| `pm2 status`da jarayon "errored" | `pm2 logs imlogram-web --lines 50` bilan xato matnini köring |
| Sayt oçilmayapti, lekin PM2 "online" | Nginx sozlamasini tekşiring: `sudo nginx -t`, keyin `sudo systemctl status nginx` |
| Bot javob bermayapti | `.env` fayldagi `TELEGRAM_BOT_TOKEN` töğriligini, va boşqa joyda bot işlab turmaganini tekşiring |
| `better-sqlite3` build xatosi | `python3-dev`/`build-essential` örnatilganini tekşiring (2-bosqiç) |
| SSL sertifikat yangilanmadi | `sudo certbot renew --dry-run` bilan sinab köring |

## Kelajakda kerak böladigan narsalar (hozir şart emas)

- **CI/CD orqali avtomatik deploy** — `git push` qilinganda server özi yangilanişi
  (GitHub Actions + SSH deploy hook). Hozirça qölda `deploy.sh` yetarli.
- **Monitoring/xato kuzatuvi** (Sentry va h.k.) — rejalaştirilgan, hali ulanmagan.
- **Ma'lumotlar bazasi zaxira nusxasi** (`apps/bot/data/bot.db`) — kamida haftada bir marta
  serverdan taşqariga nusxalab turiş tavsiya etiladi: `scp` yoki `rsync` bilan.
