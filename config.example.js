/** Bot token to access the API (get from \@BotFather). */
export const BOT_TOKEN = 'your-bot-token';

/** Bot owner ID (you can check with \@raw_data_bot). */
export const BOT_OWNER_ID = 0;

/** Number of allowed commands during `TIME_FRAME`. */
export const COMMAND_LIMIT = 3;

/**
 * The time in milliseconds during which the user can be muted if he enters more
 * than `COMMAND_LIMIT` commands.
 */
export const TIME_FRAME = 2500;

/** The time in milliseconds, for which the user will be muted for flooding. */
export const MUTE_TIME = 10000 + TIME_FRAME;
