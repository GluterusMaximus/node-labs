import { createLogger, transports, format } from 'winston';
const { timestamp, json, combine } = format;

const devLogger = () =>
  createLogger({
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [
      new transports.File({
        filename: 'error.log',
        level: 'error',
      }),
      new transports.File({ filename: 'combined.log' }),
    ],
  });

export default devLogger;
