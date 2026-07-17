# Production'ga chiqarish qo'llanmasi

Bu hujjat `imlogram.uz` saytini va `@imlogram_bot`ni **haqiqiy serverga** (VPS) chiqarib,
doimiy ishlaydigan qilish uchun amaliy, boshdan-oxirigacha bosqichma-bosqich qo'llanma.
Har bir buyruqni ketma-ket, o'zgartirmasdan ko'chirib qo'ysangiz ishlab ketadi.

## 0. Kerakli narsalar

- **VPS server** — Ubuntu 22.04 LTS tavsiya etiladi (Hetzner, DigitalOcean, Timeweb va h.k.
  — qaysi birini tanlashingiz farqi yo'q, buyruqlar bir xil ishlaydi). Minimal: 1 vCPU, 1GB RAM.
- **Domen** — `imlogram.uz`, DNS boshqaruviga kirish huquqi (A-yozuv qo'shish uchun).
- Serverga **root yoki sudo** huquqi bilan SSH orqali kirish.

## 1. Domenni serverga bog'lash (DNS)

Domen sotib olingan joyda (registrar panelida) quyidagi yozuvlarni qo'shing:

| Turi | Nomi | Qiymati |
|---|---|---|
| A | `@` | server IP manzili |
| A | `www` | server IP manzili |

DNS tarqalishi odatda 5-30 daqiqa, ba'zan bir necha soat vaqt oladi. Tekshirish:

```bash
dig +short imlogram.uz
```

Server IP manzilini ko'rsatsa — tayyor, keyingi bosqichga o'ting.

## 2. Serverni tayyorlash

SSH orqali serverga kiring, so'ng:

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

Tekshirish: `node -v` (v20.x), `pnpm -v`, `pm2 -v` — hammasi ishlashi kerak.

## 3. Kodni serverga olib kelish

```bash
cd /var/www
sudo mkdir -p imlogram && sudo chown $USER:$USER imlogram
git clone https://github.com/imlogram/imlogram.git imlogram
cd imlogram
pnpm install
```

## 4. Muhit o'zgaruvchilarini sozlash

### Bot (`apps/bot/.env`)

```bash
cp apps/bot/.env.example apps/bot/.env
nano apps/bot/.env
```

To'ldiring:

```
TELEGRAM_BOT_TOKEN=<@BotFather'dan olingan haqiqiy token>
FEEDBACK_CHANNEL_ID=<fikr-mulohaza kanali ID, masalan -100...>
FORCE_SUB_CHANNEL_ID=<majburiy a'zolik kanali ID>
FORCE_SUB_CHANNEL_USERNAME=imlogramuz
```

> **Xavfsizlik**: bu fayl `.gitignore`da, hech qachon git'ga tushmaydi. Serverda ham uni
> hech kimga ko'rsatmang, `chmod 600 apps/bot/.env` bilan huquqini cheklashingiz mumkin.

### Sayt (`apps/web`)

Hozircha maxsus muhit o'zgaruvchisi talab qilinmaydi (backend/API hali yo'q). Kelajakda
kerak bo'lsa, `apps/web/.env.local` shu tarzda qo'shiladi.

## 5. Build qilish

```bash
cd /var/www/imlogram
pnpm --filter @imlogram/parser build
pnpm --filter @imlogram/core build
pnpm --filter @imlogram/web build
pnpm --filter @imlogram/bot build
```

## 6. Saytni ishga tushirish (PM2 + Nginx)

### PM2 orqali Next.js serverini ishga tushirish

```bash
cd /var/www/imlogram/apps/web
pm2 start "pnpm start" --name imlogram-web
```

Bu `next start`ni 3000-portda doimiy ishlaydigan qilib qo'yadi.

### Nginx — reverse proxy sozlash

```bash
sudo nano /etc/nginx/sites-available/imlogram.uz
```

Quyidagini joylashtiring:

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

Yoqish va tekshirish:

```bash
sudo ln -s /etc/nginx/sites-available/imlogram.uz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Shu bosqichda `http://imlogram.uz` allaqachon ochilishi kerak.

### SSL (HTTPS) — Certbot bilan bepul sertifikat

```bash
sudo certbot --nginx -d imlogram.uz -d www.imlogram.uz
```

Savol beriladi — email kiriting, shartlarga rozilik bering, "redirect HTTP to HTTPS"
variantini tanlang. Certbot avtomatik yangilanadi (cron/systemd timer orqali), qo'lda
hech narsa qilish shart emas.

Endi `https://imlogram.uz` ishlaydi.

## 7. Botni ishga tushirish (doimiy, PM2 orqali)

```bash
cd /var/www/imlogram/apps/bot
pm2 start "node dist/index.js" --name imlogram-bot
```

Bot long-polling rejimida ishlaydi — alohida domen yoki Nginx sozlamasi shart emas.

> **Diqqat**: bir vaqtning o'zida faqat **bitta** joyda shu tokenli bot ishlashi mumkin
> (Telegram cheklovi). Agar botni lokal kompyuteringizda ham ishga tushirgan bo'lsangiz,
> uni to'xtating (`Ctrl+C`) — aks holda ikkalasi ham "Conflict" xatosi bilan to'xtaydi.

## 8. Server qayta yoqilganda avtomatik ishga tushishi

```bash
pm2 save
pm2 startup
```

`pm2 startup` chiqargan buyruqni (bitta qator, `sudo` bilan boshlanadi) nusxalab, alohida
ishga tushiring — shu orqali server reboot bo'lsa ham `imlogram-web` va `imlogram-bot`
avtomatik qayta ishga tushadi.

## 9. Holatni tekshirish

```bash
pm2 status          # ikkala jarayon ham "online" bo'lishi kerak
pm2 logs imlogram-web
pm2 logs imlogram-bot
```

Saytni tekshiring: `https://imlogram.uz`. Botni tekshiring: Telegram'da `@imlogram_bot`ga
`/start` yozing.

## 10. Yangilanishlarni serverga olib kelish

Kodda o'zgarish bo'lganda (GitHub'da yangi commit):

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

Bu ketma-ketlikni skript qilib saqlash tavsiya etiladi (`deploy.sh`):

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

## Muammolarni bartaraf qilish

| Muammo | Yechim |
|---|---|
| `pm2 status`da jarayon "errored" | `pm2 logs imlogram-web --lines 50` bilan xato matnini ko'ring |
| Sayt ochilmayapti, lekin PM2 "online" | Nginx sozlamasini tekshiring: `sudo nginx -t`, keyin `sudo systemctl status nginx` |
| Bot javob bermayapti | `.env` fayldagi `TELEGRAM_BOT_TOKEN` to'g'riligini, va boshqa joyda bot ishlab turmaganini tekshiring |
| `better-sqlite3` build xatosi | `python3-dev`/`build-essential` o'rnatilganini tekshiring (2-bosqich) |
| SSL sertifikat yangilanmadi | `sudo certbot renew --dry-run` bilan sinab ko'ring |

## Kelajakda kerak bo'ladigan narsalar (hozir shart emas)

- **CI/CD orqali avtomatik deploy** — `git push` qilinganda server o'zi yangilanishi
  (GitHub Actions + SSH deploy hook). Hozircha qo'lda `deploy.sh` yetarli.
- **Monitoring/xato kuzatuvi** (Sentry va h.k.) — `docs/spec/03-non-functional-requirements.md`da
  rejalashtirilgan, hali ulanmagan.
- **Ma'lumotlar bazasi zaxira nusxasi** (`apps/bot/data/bot.db`) — kamida haftada bir marta
  serverdan tashqariga nusxalab turish tavsiya etiladi: `scp` yoki `rsync` bilan.
