import type { Api } from "grammy";
import { env } from "./env.js";

const MEMBER_STATUSES = new Set(["member", "administrator", "creator"]);

/**
 * Fails open (returns true) on API errors rather than blocking every user
 * if the membership check itself is broken (e.g. the bot loses admin rights
 * on the channel) — a broken check should never turn into "nobody can use
 * the bot," only into "the join requirement is temporarily unenforced."
 */
export async function isChannelMember(api: Api, userId: number): Promise<boolean> {
  try {
    const member = await api.getChatMember(env.forceSubChannelId, userId);
    return MEMBER_STATUSES.has(member.status);
  } catch (err) {
    console.error("Kanal a'zoligini tekshirib bölmadi:", err);
    return true;
  }
}
