import replyToMember from '../helpers/replyToMember.js';
import getNoun from '../helpers/getNoun.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  bot.command('status', async (ctx) => {
    const status = await db.getStatus(ctx.chat.id);
    const isDefActive = status.isDefActive ? 'включён' : 'отключен';
    const stayInChatLimitUnit = getNoun(status.stayInChatLimit, 'минута', 'минуты', 'минут');

    replyToMember(
      ctx,
      `<b>ℹ️ Статус бота в чате ${ctx.chat.title}:</b>\n– Бан новоприбывших: ${isDefActive}.\n– Бан-лимит: ${status.stayInChatLimit} ${stayInChatLimitUnit}.`,
    );
  });
};
