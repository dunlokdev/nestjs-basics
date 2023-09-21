import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Render('homepage')
    renderHomePage() {
        const girlFriend = 'Lê Thị Phương Nga';
        const age = 21;

        return {
            girlFriend,
            age,
        };
    }
}
