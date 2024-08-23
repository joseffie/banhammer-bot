import { InlineKeyboard } from 'grammy';
import { guard, isPrivateChat } from 'grammy-guard';

/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => {
  bot.command('start', guard(isPrivateChat), async (ctx) => {
    bot.db.insertChat(ctx.chat.id, await bot.getLocale(ctx.from.language_code, ctx.chat.id, true));

    await bot.reply(ctx, 'start_message', false, {
      reply_markup: new InlineKeyboard().url(
        await bot.getLocaleMessage(ctx, 'start_message_button'),
        `https://t.me/${ctx.me.username}?startgroup=true`,
      ),
    });
  });
};
