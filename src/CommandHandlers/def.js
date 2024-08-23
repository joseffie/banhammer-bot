import logger from '../logger.js';
import { isAdminGuard, canBotRestrictGuard, isSupergroupGuard } from '../filters/filters.js';

/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => {
  // Prevent defence mode enableing in non-supergroups
  // due to its inability to track member join messages in them.
  bot.command('def', isSupergroupGuard(bot), isAdminGuard(bot), canBotRestrictGuard(bot), async (ctx) => {
    const hasDefModeEnabled = await bot.db.hasDefModeEnabled(ctx.chat.id);
    logger.info('def_mode', `${hasDefModeEnabled ? 'Disabled' : 'Enabled'} in chat ${ctx.chat.id}`);

    if (hasDefModeEnabled) {
      bot.db.toggleDefMode(ctx.chatId, false);
      return bot.reply(ctx, 'def_disabled', false);
    }

    bot.db.toggleDefMode(ctx.chatId, true);
    return bot.reply(ctx, 'def_enabled', false);
  });
};
