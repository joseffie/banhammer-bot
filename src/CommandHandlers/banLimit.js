import isAdminGuard from '../filters/isAdminGuard.js';
import replyToMember from '../helpers/replyToMember.js';
import getNoun from '../helpers/getNoun.js';
import logger from '../logger.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  bot.command('ban_limit', isAdminGuard, async (ctx) => {
    const match = ctx.match.trim();
    const num = parseFloat(match);

    if (match === '') {
      replyToMember(ctx, 'Введите целое число от 1 до 60 включительно.');
    } else if (match.split(' ').length > 1) {
      replyToMember(ctx, 'Вы указали слишком много аргументов.');
    } else if (Number.isNaN(num)) {
      replyToMember(ctx, 'Введите целое число.');
    } else if (!Number.isInteger(num)) {
      replyToMember(ctx, 'Введите целое число.');
    } else if (num < 1) {
      replyToMember(ctx, 'Введите число больше или равное 1.');
    } else if (num > 60) {
      replyToMember(ctx, 'Введите число меньше или равное 60.');
    } else {
      replyToMember(ctx, `Успешно установлен бан-лимит ${num} ${getNoun(num, 'минута', 'минуты', 'минут')}.`);
      db.setStayInChatLimit(ctx.chat.id, match);
      logger.info('ban_limit', `In chat ${ctx.chat.id} set ban limit ${match}`);
    }
  });
};
