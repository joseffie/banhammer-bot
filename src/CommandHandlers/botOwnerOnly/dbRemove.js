import logger from '../../logger.js';
import isBotOwnerGuard from '../../filters/isBotOwnerGuard.js';
import replyToMember from '../../helpers/replyToMember.js';

/**
 * Applied by the bot owner by replying to the message of the user to be removed to the database.
 * @param { import('grammy').Bot } bot
 * @param { import('../../DataBase.js').Database } db
 */
export default async (bot, db) => {
  bot.command('dbremove', isBotOwnerGuard, async (ctx) => {
    const { forward_origin: forwardOrigin, from } = ctx.message.reply_to_message;
    const senderId = forwardOrigin !== undefined ? forwardOrigin.sender_user.id : from.id;

    if (await db.isMemberMissing(senderId, ctx.chat.id)) {
      replyToMember(ctx, 'Данный пользователь не занесён в базу данных.');
      return;
    }

    db.deleteUser(senderId, ctx.chat.id);
    replyToMember(ctx, 'Данный пользователь успешно удалён из базы данных!');
    logger.info('admin_dbremove', `User ${senderId} from chat ${ctx.chat.id} removed from database manually`);
  });
};
