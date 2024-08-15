import { guard } from 'grammy-guard';

/**
 * @param { import('grammy').Context }
 */
const isAdminWithRestrictRights = async (ctx) => {
  const member = await ctx.getChatMember(ctx.from.id);

  return (member.status === 'administrator' && member.can_restrict_members) || member.status === 'creator';
};

export default guard(isAdminWithRestrictRights, (ctx) => {
  ctx.reply('Данная команда доступна только администраторам с правом банить участников.', {
    reply_parameters: {
      message_id: ctx.message.message_id,
    },
  });
});
