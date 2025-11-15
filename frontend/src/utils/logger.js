// KIRO-AI: Frontend logging utility for production-ready logging
// Replaces console.log with structured logging that can be disabled in production

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.level = import.meta.env.VITE_LOG_LEVEL || 'INFO';
  }

  shouldLog(level) {
    // In production, only log errors and warnings
    if (!this.isDevelopment && (level === 'INFO' || level === 'DEBUG')) {
      return false;
    }
    
    const levels = Object.keys(LOG_LEVELS);
    const currentLevelIndex = levels.indexOf(this.level);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;
    return { prefix, message, meta };
  }

  error(message, meta = {}) {
    if (this.shouldLog('ERROR')) {
      const { prefix, message: msg, meta: m } = this.formatMessage('ERROR', message, meta);
      console.error(prefix, msg, m);
    }
  }

  warn(message, meta = {}) {
    if (this.shouldLog('WARN')) {
      const { prefix, message: msg, meta: m } = this.formatMessage('WARN', message, meta);
      console.warn(prefix, msg, m);
    }
  }

  info(message, meta = {}) {
    if (this.shouldLog('INFO')) {
      const { prefix, message: msg, meta: m } = this.formatMessage('INFO', message, meta);
      console.info(prefix, msg, m);
    }
  }

  debug(message, meta = {}) {
    if (this.shouldLog('DEBUG')) {
      const { prefix, message: msg, meta: m } = this.formatMessage('DEBUG', message, meta);
      console.log(prefix, msg, m);
    }
  }
}

export const logger = new Logger();
