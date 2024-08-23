import { guard } from 'grammy-guard';
import canBotRestrict from './shared/canBotRestrict.js';
import logger from '../logger.js';

export default (bot) => guard(canBotRestrict, (ctx) => {
  bot.reply(ctx, 'bot_cannot_restrict');
  logger.warn('run_restrict', `Failed in chat ${ctx.chat.id} due to lack of restrict rights`);
});
