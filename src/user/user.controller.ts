import { Controller, Delete, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get()
    getUser(): string {
        return 'Hello User! AnhDevGa';
    }

    @Delete()
    deleteUser(): string {
        return 'Delete User! AnhDevGa';
    }
}
