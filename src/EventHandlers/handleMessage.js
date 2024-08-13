/**
 * @param { import('grammy').Bot } bot
 */
export default (bot) => {
  bot.on('message', async (ctx) => {
    if (ctx.chat.type === 'private') {
      ctx.reply('Я не работаю в личных сообщениях, взаимодействуйте со мной в чате!');
    } else if (ctx.chat.type === 'group') {
      ctx.reply('К сожалению, мои способности в чатах типа group несколько ограничены. Обновите чат до supergroup, чтобы пользоваться данной командой.', {
        reply_parameters: {
          message_id: ctx.message.message_id,
        },
      });
    }
  });
};
