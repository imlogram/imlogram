# 7. Database Design

PostgreSQL + Prisma (`@imlogram/database`, `apps/api` va `apps/workers` tomonidan
ishlatiladi). Foydalanuvchi matni default holatda saqlanmaydi (§15) — faqat explicit
"History"ga rozilik berilganda yoki scan job natijalari uchun saqlanadi.

## Prisma schema (asosiy qism)

```prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String?                    // null bo'lishi mumkin (OAuth-only user)
  name         String?
  locale       String    @default("uz-new")
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  apiKeys        ApiKey[]
  conversions    ConversionHistory[]
  scanJobs       ScanJob[]
  telegramLink   TelegramUser?
}

model ApiKey {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String                        // foydalanuvchi bergan label
  keyHash     String    @unique             // argon2 hash, xom kalit hech qachon saqlanmaydi
  keyPrefix   String                        // UI'da ko'rsatish uchun, masalan "ilg_live_8f3a"
  scopes      String[]                       // ["convert", "detect", "scan"]
  rateLimit   Int       @default(60)         // req/min
  lastUsedAt  DateTime?
  revokedAt   DateTime?
  createdAt   DateTime  @default(now())

  @@index([userId])
}

model ConversionHistory {
  id          String    @id @default(cuid())
  userId      String?
  user        User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  direction   ConversionDirection
  inputHash   String                          // SHA-256, o'zi emas — quyida izoh
  inputPreview String   @db.VarChar(280)       // faqat rozilik bilan to'liq matn saqlanadi
  charCount   Int
  createdAt   DateTime  @default(now())

  @@index([userId, createdAt])
}

model ScanJob {
  id            String    @id @default(cuid())
  userId        String?
  user          User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  rootUrl       String
  status        ScanStatus @default(QUEUED)
  maxDepth      Int        @default(3)
  maxPages      Int        @default(200)
  pagesScanned  Int        @default(0)
  pagesWithOld  Int        @default(0)
  startedAt     DateTime?
  finishedAt    DateTime?
  createdAt     DateTime   @default(now())
  error         String?

  pages         ScanPage[]
  reports       ScanReport[]

  @@index([userId, createdAt])
  @@index([status])
}

model ScanPage {
  id           String    @id @default(cuid())
  scanJobId    String
  scanJob      ScanJob   @relation(fields: [scanJobId], references: [id], onDelete: Cascade)
  url          String
  statusCode   Int?
  title        String?
  hasOldScript Boolean   @default(false)
  letterCounts Json                          // { "sh": 12, "oʻ": 4, ... }
  crawledAt    DateTime  @default(now())

  @@index([scanJobId])
  @@unique([scanJobId, url])
}

model ScanReport {
  id         String     @id @default(cuid())
  scanJobId  String
  scanJob    ScanJob    @relation(fields: [scanJobId], references: [id], onDelete: Cascade)
  format     ReportFormat
  storageKey String                          // S3-mos object key
  createdAt  DateTime   @default(now())

  @@index([scanJobId])
}

model TelegramUser {
  id            String   @id @default(cuid())
  telegramId    BigInt   @unique
  userId        String?  @unique
  user          User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  languageCode  String   @default("uz")
  dailyUsage    Int      @default(0)
  usageResetAt  DateTime @default(now())
  createdAt     DateTime @default(now())
}

model AuditLog {
  id         String   @id @default(cuid())
  actorId    String?
  action     String                          // "api_key.created", "scan.started", ...
  metadata   Json?
  createdAt  DateTime @default(now())

  @@index([actorId, createdAt])
}

enum ConversionDirection {
  OLD_TO_NEW
  NEW_TO_OLD
}

enum ScanStatus {
  QUEUED
  CRAWLING
  COMPLETED
  FAILED
}

enum ReportFormat {
  CSV
  EXCEL
  JSON
  PDF
}
```

## Muhim dizayn qarorlari

- **`inputHash` + qisqartirilgan `inputPreview`**: to'liq foydalanuvchi matnini default
  saqlamaslik uchun. Faqat duplikatsiyani aniqlash/statistika uchun hash yetarli; UI’da
  ko'rsatish uchun 280 belgigacha preview saqlanadi (foydalanuvchi buni sozlamalarda
  o'chirib qo'yishi mumkin).
- **`ApiKey.keyHash`** — xom API kalit faqat yaratilgan paytda bir marta ko'rsatiladi,
  keyin faqat argon2 hash saqlanadi (parolga o'xshash yondashuv).
- **`ScanPage.letterCounts` — `Json`** ustuni, chunki harf to'plami vaqt o'tishi bilan
  kengayishi mumkin (masalan yangi digraf qoidalari qo'shilsa) — qattiq ustunlar emas,
  moslashuvchan struktura.
- Rate-limit hisoblagichlari **Postgres’da emas, Redis’da** (token bucket) — yuqori
  chastotali yozuvlar uchun DB yukini oshirmaslik uchun.

## Indekslar va o'chirish siyosati

- `ConversionHistory` — 30 kundan eski, foydalanuvchisiz (anonim) yozuvlar cron job orqali
  o'chiriladi (`apps/workers` ichida `CleanupProcessor`, kunlik jadval).
- `ScanJob` va bog'liq `ScanPage`/`ScanReport` — 90 kundan keyin arxivlanadi (report fayllari
  S3’dan o'chiriladi, DB yozuvi statistik xulosaga siqiladi).
