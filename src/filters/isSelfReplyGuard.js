import { guard, not } from 'grammy-guard';
import isSelfReply from './shared/isSelfReply.js';

export default (bot) => guard(not(isSelfReply), (ctx) => {
  bot.reply(ctx, 'message_is_self_reply');
});
