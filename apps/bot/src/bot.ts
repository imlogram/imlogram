import { Bot, InlineKeyboard, type Context } from "grammy";
import { convertToNew, convertToOld, detect } from "@imlogram/core";
import { env } from "./env.js";
import { checkAndIncrementUsage, getUsage } from "./usage.js";
import { rememberPendingText, getPendingText } from "./pending.js";
import { saveUser } from "./db.js";
import { isChannelMember } from "./subscription.js";
import {
  WELCOME,
  HELP,
  BUTTON_TO_NEW,
  BUTTON_TO_OLD,
  BUTTON_STATS,
  CLASSIFICATION_LABEL,
  FEEDBACK_USAGE,
  FEEDBACK_THANKS,
  CONVERT_USAGE,
  DETECT_USAGE,
  TEXT_TOO_LONG,
  NOT_SUBSCRIBED_MESSAGE,
  BUTTON_JOIN_CHANNEL,
  BUTTON_CHECK_SUBSCRIPTION,
  STILL_NOT_SUBSCRIBED,
  rateLimitMessage,
  statsMessage,
  detectedMessage,
} from "./messages.js";

const MAX_TEXT_LENGTH = 4096;

export function createBot(): Bot {
  const bot = new Bot(env.botToken);

  // Registered before the subscription gate below: pressing this button is
  // exactly how a not-yet-subscribed user proves they've joined, so it must
  // be reachable regardless of subscription status.
  bot.callbackQuery("check_subscription", async (ctx) => {
    const subscribed = await isChannelMember(ctx.api, ctx.from.id);
    if (subscribed) {
      await ctx.answerCallbackQuery();
      await ctx.editMessageText(WELCOME);
    } else {
      await ctx.answerCallbackQuery({ text: STILL_NOT_SUBSCRIBED, show_alert: true });
    }
  });

  bot.use(async (ctx, next) => {
    const from = ctx.from;
    if (!from) return next();
    saveUser(from);

    const subscribed = await isChannelMember(ctx.api, from.id);
    if (!subscribed) {
      const keyboard = new InlineKeyboard()
        .url(BUTTON_JOIN_CHANNEL, `https://t.me/${env.forceSubChannelUsername}`)
        .row()
        .text(BUTTON_CHECK_SUBSCRIPTION, "check_subscription");
      await ctx.reply(NOT_SUBSCRIBED_MESSAGE, { reply_markup: keyboard });
      return;
    }

    return next();
  });

  bot.command("start", (ctx) => ctx.reply(WELCOME));
  bot.command("help", (ctx) => ctx.reply(HELP));

  bot.command("stats", (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;
    const { used, limit } = getUsage(userId);
    return ctx.reply(statsMessage(used, limit));
  });

  bot.command("convert", async (ctx) => {
    const text = ctx.match?.toString().trim();
    if (!text) return ctx.reply(CONVERT_USAGE);
    await handleTextConversion(ctx, text);
  });

  bot.command("detect", async (ctx) => {
    const text = ctx.match?.toString().trim();
    if (!text) return ctx.reply(DETECT_USAGE);
    const result = detect(text);
    const percent = Math.round(result.confidence * 100);
    await ctx.reply(detectedMessage(CLASSIFICATION_LABEL[result.classification], percent));
  });

  bot.command("fikr", async (ctx) => {
    const text = ctx.match?.toString().trim();
    if (!text) return ctx.reply(FEEDBACK_USAGE);
    const from = ctx.from;
    const reporter = from ? `${from.first_name ?? ""} ${from.last_name ?? ""} (@${from.username ?? "no_username"}, id:${from.id})`.trim() : "noma'lum";
    await bot.api.sendMessage(env.feedbackChannelId, `Yangi fikr:\n\n${text}\n\n— ${reporter}`);
    await ctx.reply(FEEDBACK_THANKS);
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith("/")) return; // unrecognized command, ignore
    await handleTextConversion(ctx, text);
  });

  bot.on("callback_query:data", async (ctx) => {
    const messageId = ctx.callbackQuery.message?.message_id;
    const userId = ctx.from.id;
    if (messageId === undefined) return ctx.answerCallbackQuery();

    if (ctx.callbackQuery.data === "stats") {
      const { used, limit } = getUsage(userId);
      await ctx.answerCallbackQuery({ text: statsMessage(used, limit), show_alert: true });
      return;
    }

    const original = getPendingText(messageId);
    if (!original) {
      await ctx.answerCallbackQuery({ text: "Matn muddati tugagan, qayta yuboring.", show_alert: true });
      return;
    }

    const result = ctx.callbackQuery.data === "to_new" ? convertToNew(original) : convertToOld(original);
    await ctx.editMessageText(result.text);
    await ctx.answerCallbackQuery();
  });

  return bot;
}

async function handleTextConversion(ctx: Context, text: string): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  if (text.length > MAX_TEXT_LENGTH) {
    await ctx.reply(TEXT_TOO_LONG);
    return;
  }

  const { allowed, limit } = checkAndIncrementUsage(userId);
  if (!allowed) {
    await ctx.reply(rateLimitMessage(limit));
    return;
  }

  const result = detect(text);
  const percent = Math.round(result.confidence * 100);
  const keyboard = new InlineKeyboard()
    .text(BUTTON_TO_NEW, "to_new")
    .text(BUTTON_TO_OLD, "to_old")
    .row()
    .text(BUTTON_STATS, "stats");

  const sent = await ctx.reply(detectedMessage(CLASSIFICATION_LABEL[result.classification], percent), {
    reply_markup: keyboard,
  });
  rememberPendingText(sent.message_id, text);
}
