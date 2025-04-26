// transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MSG_KEY } from 'src/decorator/response-message.decorator';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}

  intercept(ctx: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const res = ctx.switchToHttp().getResponse();
    const metaMsg = this.reflector.get<string>(
      RESPONSE_MSG_KEY,
      ctx.getHandler(),
    );

    return next.handle().pipe(
      map((original: any) => {
        // service trả về { result, meta } hay chỉ result?
        const hasPaging =
          original &&
          original.result !== undefined &&
          original.meta !== undefined;

        return {
          statusCode: res.statusCode ?? 200,
          message: metaMsg ?? '', // controller gắn → ưu tiên
          data: hasPaging
            ? { result: original.result, meta: original.meta }
            : { result: original, meta: null },
        };
      }),
    );
  }
}
