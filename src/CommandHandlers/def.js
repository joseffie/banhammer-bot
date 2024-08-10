import logger from '../logger.js';
import isAdminGuard from '../filters/isAdminGuard.js';
import cannotBotRestrict from '../helpers/cannotBotRestrict.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  bot.command('def', isAdminGuard, async (ctx) => {
    if (cannotBotRestrict(ctx)) {
      return;
    }

    await db.hasntChatActiveDef(ctx.chat.id).then(async (result) => {
      logger.info('def_mode', `${result ? 'Enabled' : 'Disabled'} in chat ${ctx.chat.id}`);

      if (result) {
        ctx.reply(
          'Объявляется чрезвычайное положение!\n\nВсе новоприбывшие будут мгновенно <b>отправлены в бан</b> во имя безопасности народа. Чтобы отменить чрезвычайное положение, введите /def ещё раз.',
          { parse_mode: 'HTML' },
        );

        db.toggleDefMode(ctx.chatId, true);
        return;
      }

      ctx.reply('Режим чрезвычайного положения прекращён. Чат вновь готов принимать новую кровь.');
      db.toggleDefMode(ctx.chatId, false);
    });
  });
};
