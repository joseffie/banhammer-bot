import logger from '../logger.js';
import { isAdminGuard, canBotRestrictGuard, isSupergroupGuard } from '../filters/filters.js';

/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => {
  bot.command('bannewbies', isSupergroupGuard(bot), isAdminGuard(bot), canBotRestrictGuard(bot), async (ctx) => {
    const users = await bot.db.getAllUsersInChat(ctx.chat.id);

    if (users.length === 0) {
      return bot.reply(ctx, 'no_members_in_chat');
    }

    const time = await bot.db.getStayInChatLimit(ctx.chat.id);
    let bannedUsersCount = 0;
    let loopsCount = 0;

    // eslint-disable-next-line consistent-return
    users.forEach(async (user, _, array) => {
      if ((Date.parse(new Date()) - user.join_time) < time * 60000) {
        try {
          if ((await ctx.getChatMember(user.id)).status !== 'administrator') {
            await ctx.banChatMember(user.id);
            bot.db.deleteUser(user.id, ctx.chat.id);
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
          return bot.reply(ctx, 'no_newbies_in_chat');
        }

        return bot.reply(ctx, {
          message: 'newbies_are_banned',
          options: {
            bannedUsersCount,
            banLimit: time,
          },
        });
      }
    });

    return {};
  });
};
