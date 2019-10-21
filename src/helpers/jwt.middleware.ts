import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  use(req: Request, res: Response, next: () => void) {
    if (req.headers.authorization) {
      console.log('ok...');
    }
    // console.log('Requst...', req);
    console.log('Requst...');

    next();
  }
  async isRevoked(req, payload, done) {
    const user = this.usersService.findOne(payload.sub);
    if (!user) {
      return done(null, true);
    }
    done();
  }
}
