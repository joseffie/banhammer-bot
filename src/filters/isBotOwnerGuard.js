import { guard, isUserHasId } from 'grammy-guard';
import { BOT_OWNER_ID } from '../../config.js';

export default guard(isUserHasId(BOT_OWNER_ID), (ctx) => {
  ctx.reply('Данная команда доступна только создателю бота.', {
    reply_parameters: {
      message_id: ctx.message.message_id,
    },
  });
});
