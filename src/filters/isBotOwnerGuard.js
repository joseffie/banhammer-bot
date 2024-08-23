import { guard, isUserHasId } from 'grammy-guard';
import { BOT_OWNER_ID } from '../../config.js';

export default (bot) => guard(isUserHasId(BOT_OWNER_ID), (ctx) => {
  bot.reply(ctx, 'bot_owner_only_command');
});
