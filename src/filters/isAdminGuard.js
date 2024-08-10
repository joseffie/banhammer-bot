import { guard, isAdmin } from 'grammy-guard';

export default guard(isAdmin, (ctx) => {
  ctx.reply('Данная команда доступна только администраторам.', {
    reply_parameters: {
      message_id: ctx.message.message_id,
    },
  });
});
