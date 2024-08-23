/**
 * @param { import('grammy').Context } ctx
 */
export default (ctx) => ctx.message?.reply_to_message?.from?.id === ctx.message.from.id;
