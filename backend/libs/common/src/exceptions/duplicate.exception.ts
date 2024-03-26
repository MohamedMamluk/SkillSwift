import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateException extends HttpException {
  constructor(propName: string) {
    super(`The prop "${propName}" already exists.`, HttpStatus.CONFLICT);
  }
}
