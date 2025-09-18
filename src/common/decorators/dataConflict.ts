/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ConflictException } from '@nestjs/common';

export function DataConflict(message: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await original.apply(this, args);
        return result;
      } catch (err) {
        const errorCause = (err as Error)?.cause;
        switch ((errorCause as { code: string })?.code) {
          case '23505':
          case '23503':
            throw new ConflictException(message);
          default:
            throw err;
        }
      }
    };

    return descriptor;
  };
}
