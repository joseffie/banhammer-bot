import logger from '../logger.js';
import canBotRestrict from '../filters/shared/canBotRestrict.js';

/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => {
  bot.on('message:new_chat_members', async (ctx) => {
    const { id: memberId } = ctx.update.message.new_chat_member;

    // Check that the bot has been added to a group
    if (memberId === ctx.me.id) {
      bot.db.insertChat(ctx.chat.id);
      logger.info('new_chat_member', `I was added to the chat ${ctx.chat.id}`);
      return bot.reply(ctx, 'welcome_message');
    }

    const username = ctx.update.message.new_chat_member.username === undefined
      ? null
      : ctx.update.message.new_chat_member.username;

    // If defence mode disabled, the user is just added into the database
    if (!(await bot.db.hasDefModeEnabled(ctx.chatId))) {
      bot.db.insertUser(memberId, username, ctx.chat.id, Date.parse(new Date()));
      logger.info('new_chat_member', `User ${memberId} joined to chat ${ctx.chat.id}`);
    } else if (
      await canBotRestrict(ctx) && (await ctx.getChatMember(memberId)).status !== 'administrator'
    ) {
      await ctx.banChatMember(memberId);
      bot.db.deleteUser(memberId, ctx.chat.id);
      logger.warn('new_chat_member', `User ${memberId} banned from chat ${ctx.chat.id} (defence mode)`);
    }

    return {};
  });
};
