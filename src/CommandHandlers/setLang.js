import { InlineKeyboard } from 'grammy';
import logger from '../logger.js';
import isAdminGuard from '../filters/isAdminGuard.js';

/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => {
  bot.command('setlang', isAdminGuard(bot), async (ctx) => {
    const match = ctx.match.trim().toLowerCase();

    if (match === '') {
      bot.reply(ctx, 'set_lang_menu_msg', true, {
        reply_markup: new InlineKeyboard()
          .text('🇷🇺 RU (русский)', 'set_lang_ru')
          .text('🇬🇧 EN (English)', 'set_lang_en'),
      });
    } else if (match.split(' ').length > 1) {
      bot.reply(ctx, 'too_many_arguments');
    } else if (!bot.supportedLocales.includes(match)) {
      bot.reply(ctx, 'set_lang_arg_is_not_supported_language');
    } else if (match === await bot.db.getLocale(ctx.chat.id)) {
      bot.reply(ctx, 'set_specified_lang');
    } else {
      bot.db.setLocale(ctx.chat.id, match);
      bot.reply(ctx, {
        message: 'set_lang',
        options: match,
      });
      logger.info('set_lang', `Set locale ${match.toUpperCase()} in chat ${ctx.chat.id}.`);
    }
  });
};
