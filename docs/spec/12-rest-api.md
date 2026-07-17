# 12. REST API Specification

Backend: **NestJS**. Baza URL: `https://api.imlogram.uz/v1`. To'liq mashinaviy o'qiladigan
spetsifikatsiya `@nestjs/swagger` orqali avtomatik generatsiya qilinadi va
`docs.imlogram.uz/api` da Swagger UI + OpenAPI 3.1 JSON sifatida joylashadi (FR-API-06).

## Autentifikatsiya

| Turi | Foydalanuvchi | Mexanizm |
|---|---|---|
| API kalit | Tashqi dasturchilar | `Authorization: Bearer ilg_live_<key>` header |
| Sessiya (JWT, httpOnly cookie) | Dashboard (veb) | NextAuth → NestJS JWT guard |
| Anonim | Ommaviy `/convert`, `/detect` | IP-bo'yicha past rate-limit, kalit shart emas |

## Xato formati (RFC 7807)

```json
{
  "type": "https://docs.imlogram.uz/errors/rate-limit-exceeded",
  "title": "Rate limit exceeded",
  "status": 429,
  "detail": "60 so'rov/daqiqa limitiga yetdingiz. 42 soniyadan keyin qayta urining.",
  "requestId": "req_8f3a2c"
}
```

## Endpoint'lar

### `POST /v1/convert`

```json
// Request
{
  "text": "Shahar go'zal, lekin ...",
  "direction": "old_to_new"   // | "new_to_old" | "auto"
}
// Response 200
{
  "text": "Şahar go'zal ...",
  "direction": "old_to_new",
  "changes": [ { "start": 0, "end": 2, "from": "Sh", "to": "Ş", "reason": "digraph" } ],
  "stats": { "charCount": 24, "wordCount": 4, "changedCount": 2, "readingTimeSec": 1 }
}
```

- `text` — max 100,000 belgi (anonim: 5,000).
- `direction: "auto"` — avval `detect()` chaqiriladi, ustunlik qiluvchi yozuvga qarab
  qarama-qarshi yo'nalish qo'llaniladi.

### `POST /v1/detect`

```json
// Request: { "text": "..." }
// Response
{
  "classification": "mixed",       // "old" | "new" | "mixed"
  "confidence": 0.82,
  "segments": [
    { "start": 0, "end": 40, "classification": "old" },
    { "start": 41, "end": 90, "classification": "new" }
  ]
}
```

### `POST /v1/statistics`

```json
// Response
{ "letterCounts": { "sh": 12, "ch": 4, "oʻ": 3, "gʻ": 1 }, "totalSpecialChars": 20 }
```

### `POST /v1/scan`

```json
// Request
{ "url": "https://example.uz", "maxDepth": 3, "maxPages": 200 }
// Response 202
{ "jobId": "clx1a2b3c", "status": "QUEUED", "statusUrl": "/v1/scan/clx1a2b3c" }
```

### `GET /v1/scan/:jobId`

Progress/natija — §10 dagi struktura.

### `GET /v1/scan/:jobId/export?format=csv|excel|json|pdf`

```json
{ "url": "https://storage.imlogram.uz/reports/clx1a2b3c.pdf?sig=...", "expiresAt": "2026-07-17T10:00:00Z" }
```

### `POST /v1/file`

`multipart/form-data`, maydon: `file` (.txt/.docx/.srt/.csv, max 10MB), `direction`.
Javob: konvertatsiya qilingan fayl (`Content-Disposition: attachment`) yoki, agar
`Accept: application/json` bo'lsa, matn + statistika JSON sifatida.

## Rate limiting

| Foydalanuvchi turi | `/convert` `/detect` `/statistics` | `/scan` |
|---|---|---|
| Anonim (IP) | 20 so'rov/daqiqa | 3/kun |
| Ro'yxatdan o'tgan | 60/daqiqa | 20/kun |
| API kalit (default scope) | `ApiKey.rateLimit` (default 60/daqiqa) | 10/soat |

Header’lar: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` — har bir
javobda qaytariladi (NestJS interceptor orqali).

## Versiyalash

- URL-prefiks orqali (`/v1`, `/v2`) — breaking change bo'lganda yangi versiya qo'shiladi,
  eskisi kamida 12 oy qo'llab-quvvatlanadi (§18 deprecation siyosati).
- Non-breaking o'zgarishlar (yangi optional maydon) versiya oshirmasdan qo'shiladi.
