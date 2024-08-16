import logger from '../logger.js';
import { isAdminGuard, canBotRestrictGuard } from '../filters/filters.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  bot.command('def', isAdminGuard, canBotRestrictGuard, async (ctx) => {
    const hasDefModeEnabled = await db.hasDefModeEnabled(ctx.chat.id);
    logger.info('def_mode', `${hasDefModeEnabled ? 'Disabled' : 'Enabled'} in chat ${ctx.chat.id}`);

    if (hasDefModeEnabled) {
      ctx.reply('Режим чрезвычайного положения прекращён. Чат вновь готов принимать новую кровь.');
      db.toggleDefMode(ctx.chatId, false);
      return;
    }

    ctx.reply(
      'Объявляется чрезвычайное положение!\n\nВсе новоприбывшие будут мгновенно <b>отправлены в бан</b> во имя безопасности народа. Чтобы отменить чрезвычайное положение, введите /def ещё раз.',
      { parse_mode: 'HTML' },
    );

    db.toggleDefMode(ctx.chatId, true);
  });
};
