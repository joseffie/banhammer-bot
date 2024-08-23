import logger from '../../logger.js';
import { isBotOwnerGuard, isReplyToMessageGuard, isSelfReplyGuard } from '../../filters/filters.js';

/**
 * Applied by the bot owner by replying to the message of the user to be removed to the database.
 * @param { import('../../Bot.js').Bot } bot
 */
export default async (bot) => {
  bot.command('dbremove', isBotOwnerGuard(bot), isReplyToMessageGuard(bot), isSelfReplyGuard(bot), async (ctx) => {
    const { forward_origin: forwardOrigin, from } = ctx.message.reply_to_message;
    const senderId = forwardOrigin !== undefined ? forwardOrigin.sender_user.id : from.id;

    if (await bot.db.isMemberMissing(senderId, ctx.chat.id)) {
      return bot.reply(ctx, 'user_is_not_in_db');
    }

    bot.db.deleteUser(senderId, ctx.chat.id);
    logger.info('admin_dbremove', `User ${senderId} from chat ${ctx.chat.id} removed from database manually`);
    return bot.reply(ctx, 'user_removed_from_db');
  });
};
