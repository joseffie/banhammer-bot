import logger from '../logger.js';
import isAdminGuard from '../filters/isAdminGuard.js';
import cannotBotRestrict from '../helpers/cannotBotRestrict.js';
import getNoun from '../helpers/getNoun.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  bot.command('ban_newbies', isAdminGuard, async (ctx) => {
    if (await cannotBotRestrict(ctx)) {
      return;
    }

    db.getAllUsersInChat(ctx.chat.id).then(async (users) => {
      if (users.length === 0) {
        ctx.reply('База данных для этого чата пуста. Некого банить.');
        return;
      }

      let time;
      let bannedUsersCount = 0;
      let loopsCount = 0;

      await db.getStayInChatLimit(ctx.chat.id).then((limit) => {
        time = limit;
      });

      await users.forEach(async (user, _, array) => {
        if ((Date.parse(new Date()) - user.join_time) < time * 60000) {
          try {
            await ctx.getChatMember(user.id).then(async (data) => {
              if (data.status !== 'administrator') {
                await ctx.banChatMember(user.id);
                await db.deleteUser(user.id, ctx.chat.id);
                bannedUsersCount += 1;
                logger.info('ban_newbies', `User ${user.id} banned from chat ${ctx.chat.id}`);
              }
            });
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

          ctx.reply(`Все, присоединившиеся к чату ранее, чем ${limitUnit} назад, были успешно забанены! (кувалдированных – ${bannedUsersUnit})`);
        }
      });
    });
  });
};
