import logger from '../logger.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  bot.on('my_chat_member', async (ctx) => {
    const oldMember = ctx.myChatMember.old_chat_member;
    const newMember = ctx.myChatMember.new_chat_member;

    const haveAdminRightsTakenAway
      = oldMember.status === 'administrator' && newMember.status !== oldMember.status;
    const haveRestrictRightsTakenAway
      = oldMember.can_restrict_members && !newMember.can_restrict_members;

    if (haveAdminRightsTakenAway || haveRestrictRightsTakenAway) {
      const chatId = ctx.chat.id;
      const warnTemplate = 'К сожалению, у меня были отобраны необходимые права для моей корректной работы.';
      logger.warn('rights_taken_away', `I was restricted in chat ${chatId}.`);

      if (await db.hasDefModeEnabled(chatId)) {
        db.toggleDefMode(chatId, false);
        ctx.reply(
          `${warnTemplate}\n\n❗️ Вынужден отключить режим защиты, так как на данный момент не имею возможности исполнять свои обязанности.`,
        );
        logger.warn('def_mode', `Disabled in chat ${chatId} due to restriction me.`);
        return;
      }

      ctx.reply(warnTemplate);
    }
  });
};
