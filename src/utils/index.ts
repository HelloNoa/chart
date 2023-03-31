import { InternalServerErrorException } from '@nestjs/common';

export * from './sleep.util.js';
export * from './str2ab.js';
export * from './port.js';
export * from './useSSHTunnel.js';

export function handleError<T>(...promiseResults: PromiseSettledResult<T>[]) {
  for (const result of promiseResults) {
    if (result.status === 'rejected') {
      throw new InternalServerErrorException(result.reason);
    }
  }

  return promiseResults;
}
