import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

// SQLite, not the in-memory Maps used elsewhere in this bot (usage.ts,
// pending.ts): those are fine to lose on restart, but "who has used this
// bot" is a real user directory and must survive a redeploy. Swap for a
// shared Postgres once apps/api exists.
const dataDir = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, "bot.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    telegram_id INTEGER PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    language_code TEXT,
    first_seen_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    message_count INTEGER NOT NULL DEFAULT 0
  );
`);

const upsertStmt = db.prepare(`
  INSERT INTO users (telegram_id, username, first_name, last_name, language_code, first_seen_at, last_seen_at, message_count)
  VALUES (@telegramId, @username, @firstName, @lastName, @languageCode, @now, @now, 1)
  ON CONFLICT(telegram_id) DO UPDATE SET
    username = @username,
    first_name = @firstName,
    last_name = @lastName,
    language_code = @languageCode,
    last_seen_at = @now,
    message_count = message_count + 1
`);

const countStmt = db.prepare(`SELECT COUNT(*) AS count FROM users`);

export interface TelegramUserInfo {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
}

export function saveUser(user: TelegramUserInfo): void {
  upsertStmt.run({
    telegramId: user.id,
    username: user.username ?? null,
    firstName: user.first_name ?? null,
    lastName: user.last_name ?? null,
    languageCode: user.language_code ?? null,
    now: new Date().toISOString(),
  });
}

export function getUserCount(): number {
  const row = countStmt.get() as { count: number };
  return row.count;
}
