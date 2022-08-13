enum LOG_LEVEL {
  debug = 2,
  warn = 4,
  error = 5,
}

type LoggerOptions = {
  logger?: Pick<typeof console, 'debug' | 'warn' | 'error'>;
  level?: keyof typeof LOG_LEVEL;
};

type LogFunc = (
  opts: LoggerOptions | undefined,
  msg: string,
  ...args: unknown[]
) => void;

class Logger {
  static #shouldLog(opts: LoggerOptions | undefined, lvl: LOG_LEVEL): boolean {
    return LOG_LEVEL[opts?.level ?? 'error'] <= lvl;
  }

  static #log(
    lvl: keyof typeof LOG_LEVEL,
    opts: LoggerOptions | undefined,
    msg: string,
    ...args: unknown[]
  ) {
    if (!this.#shouldLog(opts, LOG_LEVEL[lvl])) return;
    (opts?.logger ?? console)[lvl](msg, ...args);
  }

  public static readonly warn: LogFunc = (...args) =>
    this.#log('warn', ...args);

  public static readonly debug: LogFunc = (...args) =>
    this.#log('debug', ...args);

  public static readonly error: LogFunc = (...args) =>
    this.#log('error', ...args);
}

export default Logger;
export { LoggerOptions };
