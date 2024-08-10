import logger from '../logger.js';
import cannotBotRestrict from '../helpers/cannotBotRestrict.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  bot.on('message:new_chat_members', async (ctx) => {
    const { id: memberId } = ctx.update.message.new_chat_member;

    // Check that the bot has been added to a group
    if (memberId === ctx.me.id) {
      ctx.reply(
        'Доброго ранку! Ваш покорный слуга прибыл, чтобы защитить чат от массовых рейдов иностранных захватчиков!\n\nВсе мои команды находятся в /help или в меню над полем для ввода сообщений.\n\n<i>Не забудьте выдать мне право на бан участников. Без них я – как рейдеры без члена в жопе.</i>',
        { parse_mode: 'HTML' },
      );

      await db.insertChat(ctx.chat.id, ctx.chat.title);
      logger.info('new_chat_member', `I was added to the chat ${ctx.chat.id}`);
      return;
    }

    await db.hasntChatActiveDef(ctx.chatId).then(async (defModeDisabled) => {
      const username = ctx.update.message.new_chat_member.username === undefined
        ? null
        : ctx.update.message.new_chat_member.username;

      // If defence mode disabled, the user is just added into the database
      if (defModeDisabled) {
        await db.insertUser(memberId, username, ctx.chat.id, Date.parse(new Date()));
        logger.info('new_chat_member', `User ${memberId} joined to chat ${ctx.chat.id}`);
        return;
      }

      if (cannotBotRestrict(ctx)) {
        return;
      }

      ctx.getChatMember(memberId).then(async (user) => {
        if (user.status !== 'administrator') {
          await ctx.banChatMember(memberId);
          await db.deleteUser(memberId, ctx.chat.id);
          logger.warn('new_chat_member', `User ${memberId} banned from chat ${ctx.chat.id} (defence mode)`);
        }
      });
    });
  });
};
