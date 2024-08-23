import { guard } from 'grammy-guard';

/**
 * @param { import('grammy').Context }
 */
const isAdminWithRestrictRights = async (ctx) => {
  const member = await ctx.getChatMember(ctx.from.id);

  return (member.status === 'administrator' && member.can_restrict_members) || member.status === 'creator';
};

export default (bot) => guard(isAdminWithRestrictRights, (ctx) => {
  bot.reply(ctx, 'admin_only_command');
});
