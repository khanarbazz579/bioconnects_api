import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return this.appService.root();
  }

  // @Throttle(3, 60)
  @Get('health-check')
  async healthCheck() {
    return this.appService.healthCheck();
  }
}
