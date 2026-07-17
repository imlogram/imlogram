# 6. Folder Structure

## `apps/web` (Next.js — App Router)

```
apps/web/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                 # Landing
│   │   └── pricing/page.tsx
│   ├── (tools)/
│   │   ├── converter/page.tsx
│   │   ├── detector/page.tsx
│   │   └── scanner/
│   │       ├── page.tsx
│   │       └── [jobId]/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx               # Auth-guarded
│   │   ├── dashboard/page.tsx
│   │   ├── api-keys/page.tsx
│   │   └── history/page.tsx
│   ├── api/                          # Route handlers (BFF: light proxy + auth cookie -> API)
│   │   └── auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── converter/
│   ├── detector/
│   ├── scanner/
│   └── shared/
├── lib/
│   ├── api-client.ts                 # typed fetch wrapper -> api.imlogram.uz
│   └── workers/text-worker.ts        # Web Worker wrapping @imlogram/core
├── messages/                          # next-intl JSON (uz-new.json, uz-old.json, ru.json, en.json)
├── public/
├── middleware.ts
├── next.config.ts
└── package.json
```

## `apps/api` (NestJS)

```
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── filters/http-exception.filter.ts     # RFC 7807 error shape
│   │   ├── guards/api-key.guard.ts
│   │   ├── guards/jwt.guard.ts
│   │   ├── interceptors/logging.interceptor.ts
│   │   └── pipes/zod-validation.pipe.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── api-key/
│   │   ├── conversion/
│   │   │   ├── conversion.controller.ts
│   │   │   ├── conversion.service.ts             # thin wrapper over @imlogram/core
│   │   │   └── dto/
│   │   ├── detection/
│   │   ├── file/
│   │   ├── scan/
│   │   │   ├── scan.controller.ts
│   │   │   ├── scan.service.ts                    # enqueues to BullMQ, never crawls itself
│   │   │   └── dto/
│   │   ├── telegram/
│   │   │   ├── telegram.controller.ts              # webhook endpoint
│   │   │   ├── telegram.service.ts
│   │   │   └── handlers/                            # command handlers
│   │   └── health/
│   └── config/
│       └── env.validation.ts                        # zod-validated process.env
├── test/                                              # e2e (supertest)
└── package.json
```

## `apps/workers` (NestJS standalone)

```
apps/workers/
├── src/
│   ├── main.ts                       # NestFactory.createApplicationContext
│   ├── worker.module.ts
│   ├── processors/
│   │   ├── crawl.processor.ts
│   │   └── report.processor.ts
│   └── crawler/
│       ├── fetcher.ts                 # robots.txt-aware fetch
│       ├── html-extractor.ts          # cheerio-based text node extraction
│       └── link-graph.ts
└── package.json
```

## `packages/core`

```
packages/core/
├── src/
│   ├── index.ts
│   ├── convert.ts                     # convertToNew / convertToOld
│   ├── detect.ts
│   ├── statistics.ts
│   ├── rules/
│   │   ├── alphabet-map.ts            # canonical old<->new letter table
│   │   ├── apostrophe-variants.ts     # Unicode variant canonicalization
│   │   └── exceptions.ts              # curated ambiguous-word dictionary
│   └── types.ts
├── test/
│   ├── fixtures/                       # 1000+ input/expected pairs (JSON)
│   └── *.test.ts
└── package.json
```

## `packages/parser`

```
packages/parser/
├── src/
│   ├── index.ts
│   ├── segmenter.ts                    # splits text into Protected/Text spans
│   ├── protectors/
│   │   ├── url-email.ts
│   │   ├── code-block.ts               # fenced + inline markdown code
│   │   ├── html-xml.ts
│   │   ├── json-like.ts
│   │   └── front-matter.ts
│   ├── tokenizer.ts                     # longest-match digraph tokenizer
│   └── case.ts                          # case-pattern preservation
└── test/
```

Boshqa paketlar (`node`, `browser`, `react`, `next`, `cli`, `database`, `ui`,
`config-eslint`, `config-typescript`) — har biri standart `src/ + test/ + package.json`
tuzilmasiga ega, minimal skeleton; batafsil ular ishlab chiqilayotganda kengaytiriladi.
