import logger from '../logger.js';

/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => {
  bot.on('my_chat_member', async (ctx) => {
    const oldMember = ctx.myChatMember.old_chat_member;
    const newMember = ctx.myChatMember.new_chat_member;

    const haveAdminRightsTakenAway
      = oldMember.status === 'administrator' && newMember.status !== oldMember.status;
    const haveRestrictRightsTakenAway
      = oldMember.can_restrict_members && !newMember.can_restrict_members;

    if (haveAdminRightsTakenAway || haveRestrictRightsTakenAway) {
      const chatId = ctx.chat.id;
      logger.warn('rights_taken_away', `I was restricted in chat ${chatId}.`);

      try {
        if (await bot.db.hasDefModeEnabled(chatId)) {
          return bot.reply(ctx, {
            message: 'rights_taken_away_warn',
            replying: false,
            options: true,
          }).then(() => {
            bot.db.toggleDefMode(chatId, false);
            logger.warn('def_mode', `Disabled in chat ${chatId} due to restriction me.`);
          });
        }

        return bot.reply(ctx, 'rights_taken_away_warn', false);
      } catch (error) {
        console.error('An error in handling my chat member occurred:', error);
      }
    }

    return {};
  });
};
