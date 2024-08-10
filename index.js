import { Bot, GrammyError, HttpError } from 'grammy';
import { BOT_TOKEN } from './config.js';
import db from './src/DataBase.js';
import commands from './src/commandList.js';
import handleCommands from './src/CommandHandlers/index.js';
import handleEvents from './src/EventHandlers/index.js';
import logger from './src/logger.js';

const bot = new Bot(BOT_TOKEN);

bot.api.setMyCommands(commands);

handleCommands(bot, db);
handleEvents(bot, db);

bot.catch((error) => {
  const { ctx, error: err } = error;

  logger.error('bot_error', `Error while handling update ${ctx.update.update_id}:`);

  if (err instanceof GrammyError) {
    console.error('Error in request:', err.description);
  } else if (err instanceof HttpError) {
    console.error('Could not contact Telegram:', err);
  } else {
    console.error('Unknown error:', err);
  }
});

bot.start();
