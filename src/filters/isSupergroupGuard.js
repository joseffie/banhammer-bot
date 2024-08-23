import { guard, isSupergroup } from 'grammy-guard';

export default (bot) => guard(isSupergroup, (ctx) => bot.reply(ctx, 'supergroup_only'));
