// Clean logger configuration for Matrix Robot Demo
import winston from 'winston';

// Simple, clean logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      const baseMessage = `${timestamp} [${level}]: ${message}`;
      return stack ? `${baseMessage}\n${stack}` : baseMessage;
    })
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'info',
      handleExceptions: true,
      handleRejections: true
    }),
    new winston.transports.File({
      filename: 'matrix-robot-demo.log',
      level: 'debug',
      handleExceptions: true,
      handleRejections: true,
      maxsize: 5242880, // 5MB
      maxFiles: 3,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// Simple startup logging function
function logStartup(appName, version) {
  const startupInfo = {
    application: appName,
    version: version,
    node: process.version,
    platform: process.platform,
    pid: process.pid
  };

  logger.info('Application startup completed', startupInfo);
  return logger;
}

// Simple performance logging function
function logPerformance(operation, duration) {
  const message = `Performance: ${operation} took ${duration}ms`;

  if (duration > 1000) {
    logger.warn(message + ' - consider optimization');
  } else {
    logger.debug(message);
  }
}

export { logger, logStartup, logPerformance };
