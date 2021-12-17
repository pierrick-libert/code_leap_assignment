import {Config} from '../config';
import {init} from '@sentry/node';

export class SentryFactory {

  constructor(isProd: boolean = false) {
    init({
      dsn: Config.sentryDsn,
      debug: !isProd,
      environment: `[${Config.nodeEnv}]`
    });
  }

}
