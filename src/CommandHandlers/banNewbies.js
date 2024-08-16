import logger from '../logger.js';
import getNoun from '../helpers/getNoun.js';
import { isAdminGuard, canBotRestrictGuard } from '../filters/filters.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  bot.command('ban_newbies', isAdminGuard, canBotRestrictGuard, async (ctx) => {
    const users = await db.getAllUsersInChat(ctx.chat.id);

    if (users.length === 0) {
      ctx.reply('База данных для этого чата пуста. Некого банить.');
      return;
    }

    const time = db.getStayInChatLimit(ctx.chat.id);
    let bannedUsersCount = 0;
    let loopsCount = 0;

    users.forEach(async (user, _, array) => {
      if ((Date.parse(new Date()) - user.join_time) < time * 60000) {
        try {
          if ((await ctx.getChatMember(user.id)).status !== 'administrator') {
            await ctx.banChatMember(user.id);
            db.deleteUser(user.id, ctx.chat.id);
            bannedUsersCount += 1;
            logger.info('ban_newbies', `User ${user.id} banned from chat ${ctx.chat.id}`);
          }
        } catch (error) {
          console.error('There is error occurred: ', error);
        }
      }

      loopsCount += 1;

      // A workaround way to count the number of banned users in the asynchronous forEach.
      // If the ban is successful in this iteration, `bannedUsersCount` is incremented by 1.
      // At the same time in each iteration `loopsCount` is increased by 1
      // When `loopsCount` becomes equal to the length of the `users` array
      // (when all users have been enumerated), the code below is executed.
      if (loopsCount === array.length) {
        if (bannedUsersCount === 0) {
          await ctx.reply('Новичков в чате не обнаружено. Ложусь спать с чистым от крови молотом.');
          return;
        }

        const limitUnit = `${time} ${getNoun(time, 'минуту', 'минуты', 'минут')}`;
        const bannedUsersUnit = `${bannedUsersCount} ${getNoun(bannedUsersCount, 'человек', 'человека', 'человек')}`;

        ctx.reply(`Все присоединившиеся к чату ранее ${limitUnit} назад были успешно забанены! (кувалдированных – ${bannedUsersUnit})`);
      }
    });
  });
};
