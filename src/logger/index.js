import productionLogger from './productionLogger.js';
import devLogger from './devLogger.js';

const initLogger = () =>
  process.env.NODE_ENV === 'production' ? productionLogger() : devLogger();

export default initLogger;
