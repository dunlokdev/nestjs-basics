import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here if needed
    // For example, you can check if the user is an admin or has specific roles

    // Call the base class method to perform the default JWT authentication
    return super.canActivate(context) as
      | boolean
      | Promise<boolean>
      | Observable<boolean>;
  }

  handleRequest(err: any, user: any, info: any) {
    // You can customize the error handling here if needed
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token or user not found');
    }
    return user;
  }
}
