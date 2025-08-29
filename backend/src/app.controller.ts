import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @Get('healthz')
  healthz() {
    return { ok: true, ts: new Date().toISOString() };
  }

  @Get()
  root() {
    return { hello: this.app.getHello() };
  }
}
