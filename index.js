import { GrammyError, HttpError } from 'grammy';
import Bot from './src/Bot.js';
import { BOT_TOKEN } from './config.js';
import commands from './src/commandList.js';
import antiFlood from './src/middlewares/antiFlood.js';
import handleCommands from './src/CommandHandlers/index.js';
import handleEvents from './src/EventHandlers/index.js';
import logger from './src/logger.js';

const bot = new Bot(BOT_TOKEN);

bot.api.setMyCommands(commands);

bot.use(antiFlood(bot));

handleCommands(bot);
handleEvents(bot);

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
