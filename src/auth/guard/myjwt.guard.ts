import { AuthGuard } from '@nestjs/passport';

export class MyJwtGuard extends AuthGuard('jwt') {
  // handleRequest(err, user, info) {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}
