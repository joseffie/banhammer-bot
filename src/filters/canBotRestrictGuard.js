import { guard } from 'grammy-guard';
import canBotRestrict from './shared/canBotRestrict.js';
import logger from '../logger.js';

export default guard(canBotRestrict, (ctx) => {
  ctx.reply('Недостаточно прав для выполнения данного действия. Выдайте мне право на бан участников.', {
    reply_parameters: {
      message_id: ctx.message.message_id,
    },
  });

  logger.warn('run_restrict', `Failed in chat ${ctx.chat.id} due to lack of restrict rights`);
});
