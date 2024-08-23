import { supportedLocales } from '../Bot.js';
import { getNounEn } from '../helpers/getNoun.js';

export default {
  /* Middleware */
  mute_warn: (muteTime) => `You're abusing the use of commands. You have ${muteTime} seconds to cool your heels.`,

  /* Filters */
  bot_cannot_restrict: 'Not enough rights to perform this action. Grant me the right to ban participants.',
  admin_only_command: 'This command is only available to administrators with the right to ban members.',
  bot_owner_only_command: 'This command is only available to the bot owner.',
  supergroup_only: 'Add me to the supergroup for full interaction with me.',
  message_is_not_reply: 'To perform this action, you need to reply to someone\'s message.',
  message_is_self_reply: 'Unable to perform this action because you are replying to your own message.',

  /* Events */
  welcome_message: 'Good mornin\'! Your humble servant has arrived to protect the chat from mass raids by foreign invaders!\n\nAll my commands can be found in /help or in the menu above the message box.\n\n<i>Don\'t forget to grant me the right to ban members. Without them, I\'m like raiders without a dick up my ass.</i > ',
  private_chat_message: 'I don\'t work in private messages, interact with me in chat!',
  group_chat_message: 'Unfortunately, my abilities in group type chats are somewhat limited. Upgrade to supergroup to use this command.',
  rights_taken_away_warn(hasDefModeEnabled) {
    const baseTemplate = 'Unfortunately, I\'ve had the necessary rights taken away for me to work correctly.';

    if (hasDefModeEnabled) {
      return `${baseTemplate}\n\n❗️ I am forced to deactivate the defence mode as I am unable to perform my duties at the moment.`;
    }

    return baseTemplate;
  },

  /* Commands */
  too_many_arguments: 'You\'ve entered too many arguments.',

  help_message: '<b>Here\'s my list of commands:</b>\n\n/def – Enable or disable instant banning of anyone who tries to join the chat.\n\n/banlimit – Set the time(in minutes) a member is in chat after joining, during which they can be banned using the /bannewbies command. An integer number of at least 1 and not more than 60 is specified.\n\n/bannewbies – Ban all chat participants who join before the time set by /banlimit.\n\n /setlang – Set a different language for this chat (available: EN, RU). If the command is used without arguments, the language change menu is called. You can also set the language immediately using /setlang &lt;language code&gt;.\n\n/status – Bot status in this chat: /def and /banlimit values, language of the chat.\n\n<i>Note: all commands except /status can only be used by the admin.</i>',
  start_message: '👋 Good mornin\'!\n\nI am BAN H8MM8R, an assistant in the fight against chat raiders. Quickly add me to your chat to unleash my powers!\n\nTo see my commands, type /help.',
  start_message_button: 'Add to group',
  status_message({
    title, isDefActive, stayInChatLimit, locale,
  }) {
    const stayInChatLimitUnit = getNounEn(stayInChatLimit, 'minute', 'minutes');

    return `<b>ℹ️ Bot status in chat ${title}:</b>\n– Ban newbies: ${isDefActive}.\n– Ban limit: ${stayInChatLimit} ${stayInChatLimitUnit}.\n– Language code: ${locale?.toUpperCase()}.`;
  },
  status_message_private(locale) {
    return `<b>ℹ️ Bot status in private chat:</b>\n– Language code: ${locale?.toUpperCase()}.`;
  },
  def_status: (isDefActive) => (isDefActive ? 'enabled' : 'disabled'),

  /* Admin only commands */
  ban_limit_is_not_number: 'Enter an integer between 1 and 60 inclusive.',
  ban_limit_is_not_integer: 'Enter an integer.',
  ban_limit_lower_than_allowed: 'Enter an integer greater than or equal to 1.',
  ban_limit_higher_than_allowed: 'Enter an integer lower than or equal to 1.',
  ban_limit_changed(value) {
    const valueUnit = `${value} ${getNounEn(value, 'minute', 'minutes')}`;
    return `Has been successfully set the ban limit of ${valueUnit}.`;
  },
  set_lang_menu_msg: 'List of available languages:',
  set_lang_arg_is_not_supported_language: `You have entered an unsupported language.\n\nThe supported languages: ${supportedLocales}.`,
  set_specified_lang: 'This language is already set in this chat.',
  set_lang: (locale) => `Successfully set the ${locale.toUpperCase()} language for this chat.`,
  no_members_in_chat: 'The database for this chat is empty - no one to ban.',
  no_newbies_in_chat: 'No newbies to the chat. I\'m gonna bed with my hammer clean of blood.',
  newbies_are_banned({ banLimit, bannedUsersCount }) {
    const limitUnit = `${banLimit} ${getNounEn(banLimit, 'minute', 'minutes')}`;
    const bannedUsersUnit = `${bannedUsersCount} ${getNounEn(bannedUsersCount, 'person', 'people')}`;

    return `All those who joined the chat earlier ${limitUnit} ago have been successfully banned! (banned ${bannedUsersUnit})`;
  },
  def_enabled: '<b>A state of emergency has been declared!</b>\n\nAll newbies will be <b>instantly banned</b> for the safety of the people. To cancel the state of emergency, type /def again.',
  def_disabled: 'The state of emergency has been lifted. The chat room is ready to accept new blood again.',

  /* Owner only commands */
  user_already_added_to_db: 'This user is already in the database.',
  user_added_to_db: 'This user has been successfully added to the database!',
  user_is_not_in_db: 'This user is not in the database.',
  user_removed_from_db: 'This user has been successfully removed from the database!',
};
