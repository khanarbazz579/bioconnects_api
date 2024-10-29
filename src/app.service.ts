import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}
  root(): string {
    return `Hello From NyonX: ${new Date().toDateString()}`;
  }

  async healthCheck() {
    try {
      return {
        statusCode: 200,
        message: 'Success',
        fieldErrors: [],
        error: false,
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
