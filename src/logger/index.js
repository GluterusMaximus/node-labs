import productionLogger from './productionLogger.js';
import devLogger from './devLogger.js';

const initLogger = () =>
  process.env.NODE_ENV === 'production'
    ? productionLogger()
    : process.env.NODE_ENV === 'development'
    ? devLogger()
    : null;

export default initLogger;
