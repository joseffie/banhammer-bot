import logger from '../../logger.js';
import { isBotOwnerGuard, isReplyToMessageGuard, isSelfReplyGuard } from '../../filters/filters.js';

/**
 * Applied by the bot owner by replying to the message of the user to be added to the database.
 * @param { import('../../Bot.js').Bot } bot
 */
export default (bot) => {
  bot.command('dbadd', isBotOwnerGuard(bot), isReplyToMessageGuard(bot), isSelfReplyGuard(bot), async (ctx) => {
    const { forward_origin: forwardOrigin, from } = ctx.message.reply_to_message;
    const senderId = forwardOrigin !== undefined ? forwardOrigin.sender_user.id : from.id;
    const senderUsername = forwardOrigin !== undefined
      ? forwardOrigin.sender_user.username
      : from.username;

    if (await bot.db.isMemberExists(senderId, ctx.chat.id)) {
      return bot.reply(ctx, 'user_already_added_to_db');
    }

    bot.db.insertUser(
      senderId,
      senderUsername === undefined ? null : senderUsername,
      ctx.chat.id,
    );

    logger.info('admin_dbadd', `User ${senderId} from chat ${ctx.chat.id} added to the database manually`);
    return bot.reply(ctx, 'user_added_to_db');
  });
};
