/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => {
  bot.command('status', async (ctx) => {
    const status = await bot.db.getStatus(ctx.chat.id);

    if (ctx.chat.type === 'private') {
      return bot.reply(ctx, {
        message: 'status_message_private',
        options: status.locale ?? 'ru',
      });
    }

    return bot.reply(ctx, {
      message: 'status_message',
      options: {
        title: ctx.chat.title,
        isDefActive: await bot.getLocaleMessage(ctx, 'def_status', status.isDefActive),
        stayInChatLimit: status.stayInChatLimit,
        locale: status.locale,
      },
    });
  });
};
