import { isAdminGuard, isSupergroupGuard } from '../filters/filters.js';
import logger from '../logger.js';

/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => {
  bot.command('banlimit', isSupergroupGuard(bot), isAdminGuard(bot), async (ctx) => {
    const match = ctx.match.trim();
    const num = parseFloat(match);

    if (match === '') {
      bot.reply(ctx, 'ban_limit_is_not_number');
    } else if (match.split(' ').length > 1) {
      bot.reply(ctx, 'too_many_arguments');
    } else if (Number.isNaN(num) || !Number.isInteger(num)) {
      bot.reply(ctx, 'ban_limit_is_not_integer');
    } else if (num < 1) {
      bot.reply(ctx, 'ban_limit_lower_than_allowed');
    } else if (num > 60) {
      bot.reply(ctx, 'ban_limit_higher_than_allowed');
    } else {
      bot.reply(ctx, {
        message: 'ban_limit_changed',
        options: num,
      });
      bot.db.setStayInChatLimit(ctx.chat.id, match);
      logger.info('ban_limit', `In chat ${ctx.chat.id} set ban limit ${match}`);
    }
  });
};
