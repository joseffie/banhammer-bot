import { guard } from 'grammy-guard';
import isReplyToMessage from './shared/isReplyToMessage.js';

/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => guard(isReplyToMessage, (ctx) => {
  bot.reply(ctx, 'message_is_not_reply');
});
