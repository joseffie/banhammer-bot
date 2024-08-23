import { COMMAND_LIMIT, TIME_FRAME, MUTE_TIME } from '../../config.js';
import logger from '../logger.js';

const userCommands = {};

/**
 * @param { import('../Bot.js').Bot } bot
 * @returns { (ctx: import('grammy').Context, next: import('grammy').NextFunction) }
 * */
export default (bot) => (ctx, next) => {
  if (!ctx.hasCommand(['help', 'status', 'def', 'bannewbies', 'banlimit', 'setlang'])) {
    return next();
  }

  const userId = ctx.from.id;

  if (userCommands[userId]) {
    const { lastTime, isMuted } = userCommands[userId];
    const elapsedTime = Date.now() - lastTime;

    if ((isMuted && elapsedTime > MUTE_TIME) || (!isMuted && elapsedTime > TIME_FRAME)) {
      userCommands[userId] = { count: 1, isMuted: false, lastTime: Date.now() };
    } else {
      userCommands[userId].count += 1;

      // If a user exceeds the COMMAND_LIMIT within TIME_FRAME, their commands are ignored
      if (userCommands[userId].count > COMMAND_LIMIT) {
        if (elapsedTime < TIME_FRAME && !isMuted) {
          logger.info('anti_flood', `User ${userId} muted for ${(MUTE_TIME - TIME_FRAME) / 1000} seconds for flooding.`);
          userCommands[userId].isMuted = true;

          return bot.reply(ctx, {
            message: 'mute_warn',
            options: (MUTE_TIME - TIME_FRAME) / 1000,
          });
        }

        if (isMuted) return {};
      }
    }
  } else {
    userCommands[userId] = { count: 1, isMuted: false, lastTime: Date.now() };
  }

  return next();
};
