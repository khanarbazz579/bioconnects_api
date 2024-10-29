import { Logger, Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class CanLogger extends ConsoleLogger {
  /**
   * Override the Default Nest Logger function Here
   *
   * i.e. error, debug, verbose, warn etc.
   */
  error(message: string, trace: string) {
    // Invoke the Nest Logger
    super.error(message, trace);
  }
}
