import path from 'path';
import winston from 'winston';

const topLevelDirname = __dirname;

// When we run local we won't use JSON logging
const runLocal = process.env.RUN_LOCAL || false;

/* eslint-disable */
const localFormat = winston.format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
/* eslint-enable */

const parseModuleId = (callingModule: NodeModule) => {
  let pathRemaining = callingModule.id.replace(topLevelDirname, '');
  if (pathRemaining.startsWith(path.sep)) {
    pathRemaining = pathRemaining.substring(1);
  }
  if (!pathRemaining) {
    return '(global)';
  }
  return pathRemaining;
};

export default (callingModule: NodeModule): winston.Logger => {
  const logFormat = runLocal
    ? localFormat
    : winston.format.json();

  const id = parseModuleId(callingModule);
  const logger = winston.createLogger({
    level: runLocal ? 'debug' : 'info',
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.timestamp(),
      winston.format.label({
        label: id,
      }),
      logFormat,
    ),
    transports: [
      new winston.transports.Console(),
    ],
  });
  return logger;
};