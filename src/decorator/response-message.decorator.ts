// response-message.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const RESPONSE_MSG_KEY = 'responseMsg';
export const ResponseMessage = (msg: string) =>
  SetMetadata(RESPONSE_MSG_KEY, msg);
