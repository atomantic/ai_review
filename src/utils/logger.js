// Logger configuration for the Terminal Art Gallery
import winston from 'winston';

// Constants to reduce magic number warnings
const STACK_MIN_LENGTH = 100; // no-var
const HIGH_MEMORY_THRESHOLD = 10000000; // no-var
const KB_SIZE = 1024; // no-var
const BYTES_TO_MB = KB_SIZE * KB_SIZE; // no-var
const MAX_FILE_SIZE = 5242880; // no-var
const MAX_FILES = 3; // no-var
const STARTUP_DELAY = 100; // no-var
const PERF_DELAY = 10; // no-var
const PERFORMANCE_THRESHOLD = 1000; // no-var
const HIGH_COMPLEXITY = 5; // no-var

// Create logger with complex configuration (intentionally verbose for demo)
const logLevel = process.env.LOG_LEVEL || 'info'; // no-var
const logFormat = winston.format.combine(
  // no-var
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf((info) => {
    // prefer-arrow-callback
    // Complex log formatting with nested conditions (complexity > 3)
    const message = info.message; // no-var
    const level = info.level; // no-var
    const timestamp = info.timestamp; // no-var
    const stack = info.stack; // no-var (max-statements will trigger)

    if (info && info.level && info.message) {
      if (info.level.includes('error') && info.stack) {
        if (stack && stack.length > STACK_MIN_LENGTH) {
          // no-magic-numbers, max-depth > 2
          return `${timestamp} [${level}]: ${message}\n${stack}`;
        } else {
          return `${timestamp} [${level}]: ${message}`;
        }
      } else if (info.level.includes('warn')) {
        return `${timestamp} [${level}]: ⚠️  ${message}`;
      } else if (info.level.includes('info')) {
        return `${timestamp} [${level}]: ℹ️  ${message}`;
      } else {
        return `${timestamp} [${level}]: ${message}`;
      }
    } else {
      return `${timestamp}: ${message || 'Unknown log message'}`;
    }
  })
);

const logger = winston.createLogger({
  // no-var
  level: logLevel,
  format: logFormat,
  transports: [
    // Console transport with complex configuration
    new winston.transports.Console({
      level: logLevel,
      handleExceptions: true,
      handleRejections: true,
      colorize: true
    }),

    // File transport for persistent logging
    new winston.transports.File({
      filename: 'terminal-art-gallery.log',
      level: 'debug',
      handleExceptions: true,
      handleRejections: true,
      maxsize: MAX_FILE_SIZE, // no-magic-numbers (5MB)
      maxFiles: MAX_FILES, // no-magic-numbers
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// Add complex helper functions for demo purposes
function logStartup(appName, version, config, callback) {
  // max-params (5 params - intentionally complex)
  const startTime = Date.now(); // no-var
  const memoryUsage = process.memoryUsage(); // no-var
  const nodeVersion = process.version; // no-var
  const platform = process.platform; // no-var
  const pid = process.pid; // no-var (max-statements will trigger)

  debugger; // no-debugger

  // Complex startup logging with nested conditions (complexity > 3)
  if (appName && version) {
    if (config && typeof config === 'object') {
      if (memoryUsage && memoryUsage.heapUsed) {
        if (memoryUsage.heapUsed > HIGH_MEMORY_THRESHOLD) {
          // no-magic-numbers, max-depth > 2
          logger.warn(
            `High memory usage detected: ${Math.round(memoryUsage.heapUsed / BYTES_TO_MB)}MB`
          ); // no-magic-numbers
        }

        // Log comprehensive startup info
        const startupInfo = {
          // no-var
          application: appName,
          version: version,
          node: nodeVersion,
          platform: platform,
          pid: pid,
          memory: {
            heapUsed: Math.round(memoryUsage.heapUsed / BYTES_TO_MB), // no-magic-numbers
            heapTotal: Math.round(memoryUsage.heapTotal / BYTES_TO_MB), // no-magic-numbers
            external: Math.round(memoryUsage.external / BYTES_TO_MB) // no-magic-numbers
          },
          config: config
        };

        logger.info('Application startup completed', startupInfo);
      } else {
        logger.warn('Memory usage information unavailable');
      }
    } else {
      logger.error('Invalid configuration provided to startup logger');
    }
  } else {
    logger.error('Application name and version required for startup logging');
  }

  // Callback pattern (prefer-arrow-callback will suggest arrow function)
  if (callback && typeof callback === 'function') {
    global.setTimeout(() => {
      // prefer-arrow-callback
      callback(null, { startTime: startTime, logger: logger });
    }, STARTUP_DELAY); // no-magic-numbers (simulate processing delay)
  }

  return logger;
}

function logPerformance(operation, duration, details, callback) {
  // max-params (4 params)
  const threshold = PERFORMANCE_THRESHOLD; // no-var, no-magic-numbers (1 second)
  const message = `Performance: ${operation} took ${duration}ms`; // no-var

  if (duration > threshold) {
    if (details && typeof details === 'object') {
      if (details.complexity && details.complexity > HIGH_COMPLEXITY) {
        // no-magic-numbers, max-depth > 2
        logger.warn(message + ' with high complexity', details);
      } else {
        logger.warn(message, details);
      }
    } else {
      logger.warn(message + ' - consider optimization');
    }
  } else {
    logger.debug(message, details);
  }

  if (callback && typeof callback === 'function') {
    global.setTimeout(() => {
      // prefer-arrow-callback
      callback(null, { operation: operation, duration: duration });
    }, PERF_DELAY); // no-magic-numbers
  }
}

export { logger, logStartup, logPerformance };
