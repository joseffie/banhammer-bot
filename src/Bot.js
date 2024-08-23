/* eslint-disable class-methods-use-this */
import { Bot as GrammyBot } from 'grammy';
import DataBase from './DataBase.js';

/**
 * @typedef { Bot } Bot
 */

const _supportedLocales = ['ru', 'en'];

export const supportedLocales = _supportedLocales.map((locale) => locale.toUpperCase()).join(', ');

export default class Bot extends GrammyBot {
  /**
   * Creates a new Bot with the given token.
   * @param { string } token The bot's token as acquired from https://t.me/BotFather
   * @param { import('grammy').BotConfig<import('grammy').Context> } [config]
   * - Optional configuration properties for the bot
   */
  constructor(token, config) {
    super(token, config);

    /**
     * An instance of the `DataBase` class for database manipulation.
     * @type { DataBase }
     */
    this.db = DataBase;

    /**
     * List of available bot languages.
     * @type { string[] }
     */
    this.supportedLocales = _supportedLocales;
  }

  /**
   * Specifies the language in this chat room. If there is no entry in the database,
   * it is determined by the language set in the user settings. If the language is not
   * included in the supported languages of the bot, English is used by default.
   * @param { string | undefined } languageCode User's language code (`ctx.from.language_code`).
   * @param { number } chatId ID of the chat for which to try to determine the language.
   * @param { boolean } [noChatLocale=false] Indicate that there is no this chat in the database.
   * @returns { Promise<string> }
   */
  async getLocale(languageCode, chatId, noChatLocale = false) {
    const userLanguage = languageCode?.split('-')?.[0];
    const locale = noChatLocale ? undefined : await this.db.getLocale(chatId);

    return locale ?? (this.supportedLocales.includes(userLanguage) ? userLanguage : 'en');
  }

  /**
   * Returns a string with the required message by identifier depending on the set chat language.
   * @param { import('grammy').Context } ctx
   * @param { string } message Message identifier.
   * @param { any } [messageOptions] Some parameters that a message can use.
   * @returns { Promise<string> }
   */
  async getLocaleMessage(ctx, message, messageOptions) {
    const locale = await this.getLocale(ctx?.from?.language_code, ctx.chat.id);
    const { default: messages } = await import(`../src/locales/${locale}.js`);
    const currentMessage = messages[message];

    if (currentMessage === undefined) {
      throw new Error('Specified a non-exist message.');
    }

    return typeof currentMessage === 'string' ? currentMessage : currentMessage(messageOptions);
  }

  /**
   * Returns a string with the required message by identifier depending `locale` language.
   * @param { string } locale Language code in which the message is to be output.
   * @param { string } message Message identifier.
   * @param { any } [messageOptions] Some parameters that a message can use.
   * @returns { Promise<string> }
   */
  async _getLocaleMessage(locale, message, messageOptions) {
    const { default: messages } = await import(`../src/locales/${locale}.js`);
    const currentMessage = messages[message];

    if (currentMessage === undefined) {
      throw new Error('Specified a non-exist message.');
    }

    return typeof currentMessage === 'string' ? currentMessage : currentMessage(messageOptions);
  }

  /**
   * Sends a message according to the set language in the chat.
   * @param { import('grammy').Context } ctx
   * @param { Object  } message Object with information about the desired message.
   * @param { string } message.message Message identifier.
   * @param { boolean } [message.replying]
   * If set to `true` (default), reply to the user's message,
   * otherwise just send a message to the chat.
   * @param { any } [message.options] Some parameters that a message can use.
   * @param { string } message The same as `message.message`.
   * @param { boolean } [replying=true] The same as `message.replying`.
   * @param { Object } [otherOptions={}] Other options of the `other` param of the `ctx.reply`.
   */
  async reply(ctx, message, replying = true, otherOptions = {}) {
    const locale = await this.getLocale(ctx?.from?.language_code, ctx.chat.id);

    if (typeof message === 'string') {
      return ctx.reply(await this._getLocaleMessage(locale, message), {
        parse_mode: 'HTML',
        reply_parameters: replying ? { message_id: ctx.message.message_id } : undefined,
        ...otherOptions,
      });
    }

    return ctx.reply(await this._getLocaleMessage(locale, message.message, message.options), {
      parse_mode: 'HTML',
      reply_parameters: message.replying === undefined || message.replying
        ? { message_id: ctx.message.message_id } : undefined,
      ...otherOptions,
    });
  }
}
