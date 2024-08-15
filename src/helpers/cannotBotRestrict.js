import replyToMember from './replyToMember.js';
import logger from '../logger.js';

/**
 * @param { import('grammy').Context } ctx
 */
const warnAboutFailedRestrict = async (ctx) => {
  replyToMember(ctx, 'Недостаточно прав для выполнения данного действия. Выдайте мне право на бан участников.');
  logger.warn('run_restrict', `Failed in chat ${ctx.chat.id} due to lack of restrict rights`);
};

/**
 * Checks if the bot doesn't have administrator rights or the restrict rights
 * and warns about it.
 * @param { import('grammy').Context } ctx
 */
export default async (ctx) => {
  const bot = await ctx.api.getChatMember(ctx.chat.id, ctx.me.id);
  const cannotBotRestrict = bot.status !== 'administrator' || !bot.can_restrict_members;

  if (cannotBotRestrict) {
    warnAboutFailedRestrict(ctx);
  }

  return cannotBotRestrict;
};
