/**
 * Replies to the sender's message
 * @param { import('grammy').Context } ctx
 * @param { string } msg
 */
export default (ctx, msg) => {
  ctx.reply(msg, {
    reply_parameters: {
      message_id: ctx.message.message_id,
    },
    parse_mode: 'HTML',
  });
};
