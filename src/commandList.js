export default [
  {
    command: 'help',
    description: 'Информация по функционалу бота.',
  },
  {
    command: 'def',
    description: 'Включить или отключить бан всех пользователей, которые заходят в чат в данный момент.',
  },
  {
    command: 'ban_newbies',
    description: 'Забанить всех участников чата, присоединившихся раньше времени, установленного /ban_limit.',
  },
  {
    command: 'ban_limit',
    description: 'Установить время (в минутах) нахождения участника в чате после его присоединения, в течение которого он может быть забанен с помощью команды /ban_newbies. Целое число в диапазонее [1; 60].',
  },
  {
    command: 'status',
    description: 'Статус бота в данном чате: значения /def и /ban_limit.',
  },
];
