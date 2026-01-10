/**
 * Logger utility for production-safe logging
 * Only logs in development mode to prevent data leakage in production
 */

const isDev = import.meta.env.DEV;

interface Logger {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

export const logger: Logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log('[ZURBO]', ...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error('[ZURBO ERROR]', ...args);
  },

  warn: (...args: any[]) => {
    if (isDev) {
      console.warn('[ZURBO WARN]', ...args);
    }
  },

  info: (...args: any[]) => {
    if (isDev) {
      console.info('[ZURBO INFO]', ...args);
    }
  },

  debug: (...args: any[]) => {
    if (isDev) {
      console.debug('[ZURBO DEBUG]', ...args);
    }
  },
};

export default logger;