import chalk from 'chalk';

const formatNum = (num) => (num < 10 ? `0${num}` : `${num}`);

const formatMs = (ms) => {
  if (ms >= 100) {
    return ms;
  }

  return ms < 10 ? `00${ms}` : `0${ms}`;
};

const getTimeStamp = () => {
  const date = new Date();

  const hours = formatNum(date.getHours());
  const minutes = formatNum(date.getMinutes());
  const seconds = formatNum(date.getSeconds());
  const milliseconds = formatMs(date.getMilliseconds());

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
};

export default {
  info(event, msg) {
    console.log(`[${getTimeStamp()}] [${chalk.blue(event.toUpperCase())}] ${msg}`);
  },

  warn(event, msg) {
    console.log(`[${getTimeStamp()}] [${chalk.yellow(event.toUpperCase())}] ${msg}`);
  },

  error(event, msg) {
    console.log(`[${getTimeStamp()}] [${chalk.red(event.toUpperCase())}] ${msg}`);
  },
};
