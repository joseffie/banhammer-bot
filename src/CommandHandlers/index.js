import start from './start.js';
import help from './help.js';
import status from './status.js';
import def from './def.js';
import banLimit from './banLimit.js';
import banNewbies from './banNewbies.js';
import setLang from './setLang.js';
import dbAdd from './botOwnerOnly/dbAdd.js';
import dbRemove from './botOwnerOnly/dbRemove.js';

/**
 * @param { import('../Bot.js').Bot } bot
 */
export default (bot) => {
  help(bot);
  start(bot);
  status(bot);
  def(bot);
  banLimit(bot);
  banNewbies(bot);
  setLang(bot);

  // Applied by the bot owner by replying to the message of the user
  // to be added/removed to the database
  dbAdd(bot);
  dbRemove(bot);
};
