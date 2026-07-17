import { createBot } from "./bot.js";

const bot = createBot();

bot.catch((err) => {
  console.error("Bot xatoligi:", err);
});

bot.start({
  onStart: (botInfo) => {
    console.log(`@${botInfo.username} ishga tushdi (long polling).`);
  },
});

process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());
