/**
 * @param { import('grammy').Context }
 */
export default async (ctx) => {
  const bot = await ctx.api.getChatMember(ctx.chat.id, ctx.me.id);
  return bot.status === 'administrator' && bot.can_restrict_members;
};
