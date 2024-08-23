/**
 * @param { import('grammy').Context }
 */
export default (ctx) => !!ctx.message?.reply_to_message;
