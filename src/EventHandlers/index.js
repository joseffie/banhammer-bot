import handleNewChatMember from './handleNewChatMember.js';
import handleMyChatMember from './handleMyChatMember.js';
import handleCallbackQuery from './handleCallbackQuery.js';

/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => {
  handleNewChatMember(bot);
  handleMyChatMember(bot);
  handleCallbackQuery(bot);
};
