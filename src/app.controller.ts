import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @Render('homepage')
  renderHomePage() {
    const girlFriend = 'Lê Thị Phương Nga';
    const age = 21;

    console.log(this.configService.get('AUTHOR'));
    return {
      girlFriend,
      age,
    };
  }
}
