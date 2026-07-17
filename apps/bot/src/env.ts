import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Muhit o'zgaruvchisi topilmadi: ${name}. apps/bot/.env faylini tekshiring (apps/bot/.env.example namuna).`);
  }
  return value;
}

export const env = {
  botToken: required("TELEGRAM_BOT_TOKEN"),
  feedbackChannelId: required("FEEDBACK_CHANNEL_ID"),
  forceSubChannelId: required("FORCE_SUB_CHANNEL_ID"),
  forceSubChannelUsername: process.env.FORCE_SUB_CHANNEL_USERNAME ?? "imlogramuz",
};
