// Telegram callback_data is capped at 64 bytes, far too small to carry the
// converted text, so the original message text is kept here keyed by the
// bot's own reply message_id instead. Bounded so a long-running process
// doesn't leak memory if buttons are never pressed.
const MAX_ENTRIES = 2000;
const pendingText = new Map<number, string>();

export function rememberPendingText(messageId: number, text: string): void {
  if (pendingText.size >= MAX_ENTRIES) {
    const oldestKey = pendingText.keys().next().value;
    if (oldestKey !== undefined) pendingText.delete(oldestKey);
  }
  pendingText.set(messageId, text);
}

export function getPendingText(messageId: number): string | undefined {
  return pendingText.get(messageId);
}
