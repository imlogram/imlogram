# 17. CI/CD

GitHub Actions, TurboRepo remote caching (Vercel Remote Cache yoki self-hosted) bilan
tezlashtirilgan.

## Workflow'lar (`.github/workflows/`)

### `ci.yml` — har bir PR va `main`ga push

```yaml
name: CI
on: [pull_request, push]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run lint typecheck test build --affected
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
      - uses: codecov/codecov-action@v4
```

- `--affected` — faqat o'zgargan paket/app’lar va ularga bog'liqlarni ishga tushiradi
  (TurboRepo’ning `--filter=...[origin/main]` mexanizmi) — katta monorepo’da CI vaqtini
  qisqartiradi.

### `e2e.yml` — PR’da (draft bo'lmagan) va `main`ga merge’dan keyin

- Playwright, Docker Compose orqali to'liq stack (web + api + postgres + redis) ko'tariladi.
- Artifact sifatida video/screenshot xato bo'lganda saqlanadi.

### `codeql.yml` — haftalik + har PR

- GitHub CodeQL statik xavfsizlik tahlili (JS/TS).

### `changesets.yml` — `main`ga push

- Agar `.changeset/*.md` fayllari bo'lsa: "Version Packages" PR avtomatik yaratiladi/
  yangilanadi (Changesets bot).
- Agar shu PR merge qilinsa (ya'ni versiyalar allaqachon bump qilingan): `pnpm changeset
  publish` ishga tushadi, npm’ga publish qiladi (§18) va git tag’lar qo'yiladi.

### `docker.yml` — `main`ga merge’dan keyin (`apps/api`, `apps/workers` o'zgarsa)

- Multi-stage Dockerfile build, GitHub Container Registry’ga push (`ghcr.io/imlogram/api:sha`,
  `:latest`).
- Deploy hook (Fly.io/Render webhook yoki `kubectl set image`) — **staging**ga avtomatik,
  **production**ga faqat qo'lda tasdiqlash (`environment: production` + required reviewer,
  GitHub Environments orqali).

### `web-deploy` — Vercel’ning o'z Git integratsiyasi orqali (alohida workflow shart emas)

- Har PR uchun Preview Deployment, `main` uchun Production Deployment avtomatik.

## Branch strategiyasi

- `main` — har doim deploy-qilinadigan holatda.
- Feature branch’lar → PR → kamida 1 reviewer + barcha CI check’lar yashil → squash merge.
- To'g'ridan-to'g'ri `main`ga push cheklangan (branch protection rule).

## Muhit sirlari (GitHub Secrets/Environments)

| Secret | Vazifa |
|---|---|
| `TURBO_TOKEN`, `TURBO_TEAM` | Remote cache |
| `NPM_TOKEN` | Changesets publish |
| `DATABASE_URL` (staging) | E2E/integration testlar |
| `FLY_API_TOKEN` / `RENDER_DEPLOY_HOOK` | Deploy |
| `SENTRY_AUTH_TOKEN` | Source map yuklash |

## Sifat gate'lari (PR mergedan oldin majburiy)

- Lint, typecheck, unit+integration test, build — barchasi yashil.
- Coverage pasaymasligi (Codecov "patch coverage" check).
- Playwright E2E (draft PR’larda o'tkazib yuboriladi, tezlik uchun).
- Xavfsizlik: Dependabot/CodeQL kritik topilma yo'q.
