import { createLogger, transports, format } from 'winston';
const { timestamp, json, combine, printf } = format;

const consoleFormat = printf(({ level, message, timestamp, status }) => {
  return `${timestamp} ${level} ${status ?? ''}: ${message}`;
});

const devLogger = () =>
  createLogger({
    level: 'info',
    format: combine(timestamp({ format: 'HH:mm:ss' }), json()),
    transports: [
      new transports.Console({ format: consoleFormat }),
      new transports.File({
        filename: 'error.log',
        dirname: 'logs',
        level: 'error',
      }),
      new transports.File({ filename: 'combined.log', dirname: 'logs' }),
    ],
  });

export default devLogger;
