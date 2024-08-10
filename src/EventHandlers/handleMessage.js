import logger from '../logger.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  bot.on('message', async (ctx) => {
    if (ctx.chat.type === 'private') {
      ctx.reply('Я не работаю в личных сообщениях, взаимодействуйте со мной в чате!');
    } else if (ctx.chat.type === 'group') {
      ctx.reply('К сожалению, мои способности в чатах типа group несколько ограничены. Обновите чат до supergroup, чтобы пользоваться данной командой.', {
        reply_parameters: {
          message_id: ctx.message.message_id,
        },
      });
    } else if (ctx.update?.message?.new_chat_title) {
      const newTitle = ctx.update.message.new_chat_title;
      await db.updateChatTitle(ctx.chat.id, newTitle);
      logger.info('chat_rename', `Updated chat ${ctx.chat.id} title to ${newTitle}`);
    }
  });
};
