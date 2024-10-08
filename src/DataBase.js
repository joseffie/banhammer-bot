import sqlite3 from 'sqlite3';

/**
 * @typedef { DataBase } Database
 */

class DataBase {
  constructor() {
    /** @private */
    this._db = new (sqlite3.verbose()).Database('DataBase.db');
    this._init();
  }

  /**
   * Creates tables in the database if they do not exist.
   * @private
   */
  _init() {
    this._db.serialize(() => {
      this._db.run('CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY, is_def_active INTEGER DEFAULT 0, stay_in_chat_limit INTEGER DEFAULT 10, locale TEXT DEFAULT \'en\')');

      this._db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER NOT NULL, username TEXT, chat_id INTEGER NOT NULL, join_time INTEGER NOT NULL, UNIQUE(id, chat_id), FOREIGN KEY (chat_id) REFERENCES chats (id))');
    });
  }

  /**
   * Inserts a new chat into the database.
   * @param { number } id Chat ID.
   * @param { string } [locale='ru'] Language code.
   */
  insertChat(id, locale = 'ru') {
    this._db.run('INSERT OR IGNORE INTO chats VALUES (?, 0, 10, ?)', [id, locale]);
  }

  /**
   * Inserts a new chat member into the database.
   * @param { number } id User ID.
   * @param { string } username User username without `@`.
   * @param { number } chatId Chat ID where user from.
   * @param { number } [joinTime=Date.parse(new Date())]
   * Time the user joined the chat in milliseconds elapsed since 1 January 1970 00:00:00 UTC.
   */
  insertUser(id, username, chatId, joinTime = Date.parse(new Date())) {
    this._db.run('INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?)', [id, username, chatId, joinTime]);
  }

  /**
   * Deletes a chat member from the database.
   * @param { number } id User ID.
   * @param { number } chatId Chat ID where user from.
   */
  deleteUser(id, chatId) {
    this._db.run('DELETE FROM users WHERE id = ? and chat_id = ?', [id, chatId]);
  }

  /**
   * Updates the `stay_in_chat_limit` value for the given chat.
   * @param { number } id Chat ID.
   * @param { number } time Time since joining a user allowed to be banned.
   */
  setStayInChatLimit(id, time) {
    this._db.run('UPDATE chats SET stay_in_chat_limit = ? WHERE id = ?', [time, id]);
  }

  /**
   * Updates the locale for the given chat.
   * @param { number } id Chat ID.
   * @param { string } locale Language code.
   */
  setLocale(id, locale) {
    this._db.run('UPDATE chats SET locale = ? WHERE id = ?', [locale, id]);
  }

  /**
   * Toggles the defence mode in the given chat.
   * @param { number } id Chat ID.
   * @param { boolean } enable Enable the defence mode or not.
   */
  toggleDefMode(id, enable) {
    this._db.run('UPDATE chats SET is_def_active = ? WHERE id = ?', [enable ? 1 : 0, id]);
  }

  /**
   * Checks if the defence mode is enabled.
   * @param { number } id Chat ID.
   * @returns { Promise<boolean> }
   */
  hasDefModeEnabled(id) {
    return new Promise((resolve, reject) => {
      this._db.get('SELECT is_def_active FROM chats WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        }

        resolve(row?.is_def_active === 1);
      });
    });
  }

  /**
   * Gets the `stay_in_chat_limit` value for the given chat.
   * @param { number } id Chat ID.
   * @returns { Promise<number> }
   */
  getStayInChatLimit(id) {
    return new Promise((resolve, reject) => {
      this._db.get('SELECT stay_in_chat_limit FROM chats WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        }

        resolve(row?.stay_in_chat_limit);
      });
    });
  }

  /**
   * Gets the locale for the given chat.
   * @param { number } id Chat ID.
   * @returns { Promise<string> }
   */
  getLocale(id) {
    return new Promise((resolve, reject) => {
      this._db.get('SELECT locale FROM chats WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        }

        resolve(row?.locale);
      });
    });
  }

  /**
   * Gets the data of the given chat.
   * @param { number } id Chat ID.
   */
  getStatus(id) {
    return new Promise((resolve, reject) => {
      this._db.get('SELECT is_def_active, stay_in_chat_limit, locale FROM chats WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        }

        resolve({
          isDefActive: row?.is_def_active === 1,
          stayInChatLimit: row?.stay_in_chat_limit,
          locale: row?.locale,
        });
      });
    });
  }

  /**
   * Checks if the user with the given ID is exists in the given chat.
   * @param { number } id User ID.
   * @param { number } chatId Chat ID where user from.
   * @returns { Promise<boolean> }
   */
  isMemberExists(id, chatId) {
    return new Promise((resolve, reject) => {
      this._db.get('SELECT id FROM users WHERE id = ? AND chat_id = ?', [id, chatId], (err, row) => {
        if (err) {
          reject(err);
        }

        resolve(row?.id !== undefined);
      });
    });
  }

  /**
   * Checks if the user with the given ID is missing in the given chat.
   * @param { number } id User ID.
   * @param { number } chatId Chat ID where user from.
   * @returns { Promise<boolean> }
   */
  isMemberMissing(id, chatId) {
    return new Promise((resolve, reject) => {
      this._db.get('SELECT id FROM users WHERE id = ? AND chat_id = ?', [id, chatId], (err, row) => {
        if (err) {
          reject(err);
        }

        resolve(row?.id === undefined);
      });
    });
  }

  /**
   * Gets the date the user joined the given chat.
   * @param { number } id User ID.
   * @param { number } chatId Chat ID where user from.
   * @returns { Promise<number> }
   */
  getUserJoinDate(id, chatId) {
    return new Promise((resolve, reject) => {
      this._db.get('SELECT join_time FROM users WHERE id = ? and chat_id = ?', [id, chatId], (err, row) => {
        if (err) {
          reject(err);
        }

        resolve(row?.join_time);
      });
    });
  }

  /**
   * Gets an array of members of the given chat.
   * @param { number } id Chat ID.
   * @returns { Promise<any[]> }
   */
  getAllUsersInChat(id) {
    return new Promise((resolve, reject) => {
      this._db.all('SELECT id, join_time FROM users WHERE chat_id = ?', [id], (err, users) => {
        if (err) {
          reject(err);
        }

        resolve(users);
      });
    });
  }
}

export default new DataBase();
