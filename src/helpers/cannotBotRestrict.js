import replyToMember from './replyToMember.js';
import logger from '../logger.js';

/**
 * @param { import('grammy').Context } ctx
 */
const warnAboutFailedRestrict = async (ctx) => {
  replyToMember(ctx, 'Не могу применить данную команду в действии, выдайте мне право банить участников.');
  logger.warn('run_restrict', `Failed in chat ${ctx.chat.id} due to lack of restrict rights`);
};

/**
 * @param { import('grammy').Context } ctx
 */
const checkIfBotCannotRestrict = async (ctx) => {
  let chatMember;

  try {
    chatMember = await ctx.api.getChatMember(ctx.chat.id, ctx.me.id);
  } catch (error) {
    console.error('Error checking bot rights:', error);
  }

  return chatMember.status !== 'administrator' || !chatMember.can_restrict_members;
};

/**
 * Checks if the bot doesn't have administrator rights or the restrict rights
 * and warns about it.
 * @param { import('grammy').Context } ctx
 */
export default async (ctx) => {
  let itCannot = false;

  await checkIfBotCannotRestrict(ctx).then((cannotRestrict) => {
    if (cannotRestrict) {
      itCannot = true;
      warnAboutFailedRestrict(ctx);
    }
  });

  return itCannot;
};
