import handleNewChatMember from './handleNewChatMember.js';
import handleMessage from './handleMessage.js';
import handleMyChatMember from './handleMyChatMember.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  handleNewChatMember(bot, db);
  handleMyChatMember(bot, db);
  handleMessage(bot);
};
