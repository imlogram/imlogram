// In-memory placeholder for the Redis/Postgres-backed usage tracking designed
// in docs/spec/07-database-design.md (TelegramUser.dailyUsage) — fine for a
// single bot process, resets on restart. Swap for the real DB once apps/api
// exists.
const DAILY_LIMIT = 100;
const DAY_MS = 24 * 60 * 60 * 1000;

interface UsageRecord {
  count: number;
  resetAt: number;
}

const usage = new Map<number, UsageRecord>();

function currentRecord(userId: number): UsageRecord {
  const now = Date.now();
  const existing = usage.get(userId);
  if (existing && now < existing.resetAt) return existing;
  const fresh: UsageRecord = { count: 0, resetAt: now + DAY_MS };
  usage.set(userId, fresh);
  return fresh;
}

export function checkAndIncrementUsage(userId: number): { allowed: boolean; used: number; limit: number } {
  const record = currentRecord(userId);
  if (record.count >= DAILY_LIMIT) {
    return { allowed: false, used: record.count, limit: DAILY_LIMIT };
  }
  record.count += 1;
  return { allowed: true, used: record.count, limit: DAILY_LIMIT };
}

export function getUsage(userId: number): { used: number; limit: number } {
  const record = currentRecord(userId);
  return { used: record.count, limit: DAILY_LIMIT };
}
