import start from './start.js';
import help from './help.js';
import status from './status.js';
import def from './def.js';
import banLimit from './banLimit.js';
import banNewbies from './banNewbies.js';
import dbAdd from './botOwnerOnly/dbAdd.js';
import dbRemove from './botOwnerOnly/dbRemove.js';

/**
 * @param { import('grammy').Bot } bot
 * @param { import('../DataBase.js').Database } db
 */
export default (bot, db) => {
  start(bot);
  help(bot);
  status(bot, db);
  banLimit(bot, db);
  banNewbies(bot, db);

  // Prevent defence mode enableing in non-supergroups
  // due to its inability to track member join messages in them.
  def(bot.chatType('supergroup'), db);

  // Applied by the bot owner by replying to the message of the user
  // to be added/removed to the database
  dbAdd(bot, db);
  dbRemove(bot, db);
};
