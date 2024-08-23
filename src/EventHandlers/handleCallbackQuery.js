import logger from '../logger.js';

/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => {
  bot.on('callback_query:data', async (ctx) => {
    if (ctx.callbackQuery.data.startsWith('set_lang')) {
      const lang = ctx.callbackQuery.data.split('_').pop();
      const chatId = ctx.callbackQuery.message.chat.id;

      if (lang === await bot.db.getLocale(chatId)) {
        return ctx.answerCallbackQuery(await bot.getLocaleMessage(ctx, 'set_specified_lang'));
      }

      bot.db.setLocale(chatId, lang);
      await ctx.answerCallbackQuery();
      await bot.api.deleteMessage(chatId, ctx.callbackQuery.message.message_id);

      logger.info('set_lang', `Set locale ${lang.toUpperCase()} in chat ${ctx.chat.id}.`);

      return bot.reply(ctx, {
        message: 'set_lang',
        replying: false,
        options: lang,
      });
    }

    return {};
  });
};
