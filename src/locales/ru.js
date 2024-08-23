import { supportedLocales } from '../Bot.js';
import getNoun from '../helpers/getNoun.js';

export default {
  /* Middleware */
  mute_warn: (muteTime) => `Вы злоупотребляете использованием команд. Вам даётся ${muteTime} секунд на остужение своего пыла.`,

  /* Filters */
  bot_cannot_restrict: 'Не могу выполнить данное действие из-за отстуствия права банить участников чата.',
  admin_only_command: 'Данная команда доступна только администраторам с правом банить участников чата.',
  bot_owner_only_command: 'Данная команда доступна только создателю бота.',
  supergroup_only: 'Добавьте меня в супергруппу для полного взаимодействия со мной.',
  message_is_not_reply: 'Чтобы выполнить данное действие, нужно ответить на чьё-то сообщение.',
  message_is_self_reply: 'Невозможно выполнить данное действие, так как Вы отвечаете на своё сообщение.',

  /* Events */
  welcome_message: 'Доброго ранку! Ваш покорный слуга прибыл, чтобы защитить чат от массовых рейдов иностранных захватчиков!\n\nВсе мои команды находятся в /help или в меню над полем для ввода сообщений.\n\n<i>Не забудьте выдать мне право на бан участников. Без них я – как рейдеры без члена в жопе.</i>',
  private_chat_message: 'Я не работаю в личных сообщениях, взаимодействуйте со мной в чате!',
  group_chat_message: 'К сожалению, мои способности в чатах типа group несколько ограничены. Обновите чат до supergroup, чтобы пользоваться данной командой.',
  rights_taken_away_warn(hasDefModeEnabled) {
    const baseTemplate = 'К сожалению, у меня были отобраны необходимые права для моей корректной работы.';

    if (hasDefModeEnabled) {
      return `${baseTemplate}\n\n❗️ Вынужден отключить режим защиты, так как на данный момент не имею возможности исполнять свои обязанности.`;
    }

    return baseTemplate;
  },

  /* Commands */
  too_many_arguments: 'Вы ввели слишком много аргументов.',

  help_message: '<b>Вот мой список команд:</b>\n\n/def – Включить или отключить мгновенный бан всех, кто пытается присоединиться к чату.\n\n/banlimit – Установить время (в минутах) нахождения участника в чате после его присоединения, в течение которого он может быть забанен с помощью команды /bannewbies. Указывается целое число не менее 1 и не более 60.\n\n/bannewbies – Забанить всех участников чата, присоединившихся раньше времени, установленного /banlimit.\n\n/setlang – Установить другой язык для этого чата (доступно: EN, RU). Если использована команда без аргументов, вызывается меню смены языка. Также можно сразу установить язык, воспользовавшись /setlang &lt;код языка&gt;.\n\n/status – Статус бота в данном чате: значения /def и /banlimit, установленный язык.\n\n<i>Прим.: все команды, кроме /status, может использовать только админ.</i>',
  start_message_button: 'Добавить в группу',
  status_message({
    title, isDefActive, stayInChatLimit, locale,
  }) {
    const stayInChatLimitUnit = getNoun(stayInChatLimit, 'минута', 'минуты', 'минут');

    return `<b>ℹ️ Статус бота в чате ${title}:</b>\n– Бан новоприбывших: ${isDefActive}.\n– Бан-лимит: ${stayInChatLimit} ${stayInChatLimitUnit}.\n– Язык: ${locale?.toUpperCase()}.`;
  },
  status_message_private(locale) {
    return `<b>ℹ️ Статус бота в приватном чате:</b>\n– Язык: ${locale?.toUpperCase()}.`;
  },
  def_status: (isDefActive) => (isDefActive ? 'включен' : 'отключен'),

  /* Admin only commands */
  ban_limit_is_not_number: 'Введите целое число от 1 до 60 включительно.',
  ban_limit_is_not_integer: 'Введите целое число.',
  ban_limit_lower_than_allowed: 'Введите число больше или равное 1.',
  ban_limit_higher_than_allowed: 'Введите число меньше или равное 60.',
  ban_limit_changed(value) {
    const valueUnit = `${value} ${getNoun(value, 'минута', 'минуты', 'минут')}`;
    return `Успешно установлен бан-лимит ${valueUnit}.`;
  },
  set_lang_menu_msg: 'Список доступных языков:',
  set_lang_arg_is_not_supported_language: `Вы указали неподдерживаемый язык.\n\nПоддерживаемые языки: ${supportedLocales}.`,
  set_specified_lang: 'Данный язык уже установлен в этом чате.',
  set_lang: (locale) => `Успешно установлен язык ${locale.toUpperCase()} для этого чата.`,
  no_members_in_chat: 'База данных для этого чата пуста – некого банить.',
  no_newbies_in_chat: 'Новичков в чате не обнаружено. Ложусь спать с чистым от крови молотом.',
  newbies_are_banned({ banLimit, bannedUsersCount }) {
    const limitUnit = `${banLimit} ${getNoun(banLimit, 'минуты', 'минут', 'минут')}`;
    const bannedUsersUnit = `${bannedUsersCount} ${getNoun(bannedUsersCount, 'человек', 'человека', 'человек')}`;

    return `Все присоединившиеся к чату ранее ${limitUnit} назад были успешно забанены! (кувалдированных – ${bannedUsersUnit})`;
  },
  def_enabled: '<b>Объявляется чрезвычайное положение!</b>\n\nВсе новоприбывшие будут мгновенно <b>отправлены в бан</b> во имя безопасности народа. Чтобы отменить чрезвычайное положение, введите /def ещё раз.',
  def_disabled: 'Режим чрезвычайного положения прекращён. Чат вновь готов принимать новую кровь.',

  /* Owner only commands */
  user_already_added_to_db: 'Данный пользователь уже занесён в базу данных.',
  user_added_to_db: 'Данный пользователь успешно добавлен в базу данных!',
  user_is_not_in_db: 'Данный пользователь не занесён в базу данных.',
  user_removed_from_db: 'Данный пользователь успешно удалён из базы данных!',
};
