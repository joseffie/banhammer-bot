/**
 * @param { import('grammy').Bot } bot
 */
export default (bot) => {
  bot.command('start', async (ctx) => {
    if (ctx.chat.type === 'private') {
      ctx.reply('👋 Доброго ранку!\n\nЯ – М8Л8ТХ БАНА, помощник в борьбе с рейдерами чатов. Скорее добавляйте меня в свой чат, чтобы задействовать мои силы!\n\nЧтобы ознакомиться с моими командами, введите /help.');
    }
  });
};
