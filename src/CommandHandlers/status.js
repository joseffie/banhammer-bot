import replyToMember from '../helpers/replyToMember.js';
import getNoun from '../helpers/getNoun.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  bot.command('status', async (ctx) => {
    db.getStatus(ctx.chat.id).then((status) => {
      const isDefActive = status.isDefActive ? 'включён' : 'отключен';
      const { title, stayInChatLimit } = status;
      const stayInChatLimitUnit = getNoun(stayInChatLimit, 'минута', 'минуты', 'минут');

      replyToMember(
        ctx,
        `<b>ℹ️ Статус бота в чате ${title}:</b>\n– Бан новоприбывших: ${isDefActive}.\n– Бан-лимит: ${stayInChatLimit} ${stayInChatLimitUnit}.`,
      );
    });
  });
};
