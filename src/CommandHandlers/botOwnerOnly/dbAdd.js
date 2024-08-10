import logger from '../../logger.js';
import isBotOwnerGuard from '../../filters/isBotOwnerGuard.js';
import replyToMember from '../../helpers/replyToMember.js';

/**
 * Applied by the bot owner by replying to the message of the user to be added to the database.
 * @param { import('grammy').Bot } bot
 * @param { import('../../DataBase.js').Database } db
 */
export default (bot, db) => {
  bot.command('dbadd', isBotOwnerGuard, (ctx) => {
    const { forward_origin: forwardOrigin, from } = ctx.message.reply_to_message;
    const senderId = forwardOrigin !== undefined ? forwardOrigin.sender_user.id : from.id;
    const senderUsername = forwardOrigin !== undefined
      ? forwardOrigin.sender_user.username
      : from.username;

    db.isMemberExists(senderId, ctx.chat.id).then((isMemberExists) => {
      if (isMemberExists) {
        replyToMember(ctx, 'Данный пользователь уже занесён в базу данных.');
        return;
      }

      db.insertUser(
        senderId,
        senderUsername === undefined ? null : senderUsername,
        ctx.chat.id,
        Date.parse(new Date()),
      );

      replyToMember(ctx, 'Данный пользователь успешно добавлен в базу данных!');
      logger.info('admin_dbadd', `User ${senderId} from chat ${ctx.chat.id} added to the database manually`);
    });
  });
};
