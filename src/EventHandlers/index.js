import handleNewChatMember from './handleNewChatMember.js';
import handleMessage from './handleMessage.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  handleNewChatMember(bot, db);
  handleMessage(bot);
};
