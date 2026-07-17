// In-memory placeholder for the Postgres-backed usage tracking designed in
// docs/spec/07-database-design.md (TelegramUser.dailyUsage) — fine for a
// single bot process, resets on restart. No enforced cap: this only counts
// usage for the /stats display, it never blocks a user.
const usage = new Map<number, number>();

export function recordUsage(userId: number): number {
  const count = (usage.get(userId) ?? 0) + 1;
  usage.set(userId, count);
  return count;
}

export function getUsage(userId: number): number {
  return usage.get(userId) ?? 0;
}
