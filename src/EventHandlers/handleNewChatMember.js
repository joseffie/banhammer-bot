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

      db.insertChat(ctx.chat.id);
      logger.info('new_chat_member', `I was added to the chat ${ctx.chat.id}`);
      return;
    }

    const isDefModeDisabled = await db.hasntChatActiveDef(ctx.chatId);
    const username = ctx.update.message.new_chat_member.username === undefined
      ? null
      : ctx.update.message.new_chat_member.username;

    // If defence mode disabled, the user is just added into the database
    if (isDefModeDisabled) {
      db.insertUser(memberId, username, ctx.chat.id, Date.parse(new Date()));
      logger.info('new_chat_member', `User ${memberId} joined to chat ${ctx.chat.id}`);
    } else if (
      !(await cannotBotRestrict(ctx)) && (await ctx.getChatMember(memberId)).status !== 'administrator'
    ) {
      await ctx.banChatMember(memberId);
      db.deleteUser(memberId, ctx.chat.id);
      logger.warn('new_chat_member', `User ${memberId} banned from chat ${ctx.chat.id} (defence mode)`);
    }
  });
};
