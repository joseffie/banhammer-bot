/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => {
  bot.command('help', async (ctx) => bot.reply(ctx, 'help_message'));
};
