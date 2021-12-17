import {captureException} from '@sentry/node';
import {createLogger, format, transports, Logger, LogEntry} from 'winston';

export class LoggerFactory {

  private logger: Logger;

  constructor(isProd: boolean = false) {
    this.logger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.json(),
      ),
      level: isProd === true ? 'error' : 'debug',
      transports: [
        new transports.Console({})
        // new transports.File({ filename: 'logs/socket.log', level: 'verbose' })
      ]
    });
    // Create middlewares to send data to Sentry in case of error
    // The 'logged' event can only be on the transports so listening the first one should do the work
    // and avoid the duplicated in Sentry
    this.logger.transports[0].on('logged', (data: LogEntry) => {
      // Only send data to Sentry in case of error
      if (data.level === 'error') {
        captureException(data);
      }
    });
    this.logger.on('error', (error: Error) => {
      captureException(error);
    });
  }

  // Return the PostgreSQL pool
  public getLogger(): Logger {
    return this.logger;
  }

}
