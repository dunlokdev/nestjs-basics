import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here if needed
    // For example, you can check if the user is an admin or has specific roles

    // Call the base class method to perform the default JWT authentication
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Skip JWT authentication for public routes
    }

    return super.canActivate(context); // Proceed with JWT authentication
  }

  handleRequest(err: any, user: any, info: any) {
    // You can customize the error handling here if needed
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token or user not found');
    }
    return user;
  }
}
