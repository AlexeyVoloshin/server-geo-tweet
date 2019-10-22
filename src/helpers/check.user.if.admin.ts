import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
// tslint:disable-next-line:no-var-requires
import * as JWT from 'jwt-decode';
import * as expressJwt from 'express-jwt';
// import { jwt}

@Injectable()
export class CheckUserIfAdmin implements NestMiddleware {
  constructor(private usersService: UsersService) {}
 async use(req: Request, res: Response, next: () => void) {
    const user = await this.getUserFromToken(req.headers.authorization);
    if (user['admin']) {
        next();
      } else {
        return res.status(400).send('Access is denied');
      }
  }
  async getUserFromToken(authorization) {
      try {
        if (typeof (authorization) !== 'undefined') {
          const token = authorization.split(' ')[1];
          const decodedToken = JWT(token);
          const user = await this.usersService.findUserById(decodedToken.sub);
          if (user) {
            return user;
          } else {
            return {
              error: 'no user found',
              code: 400,
            };
          }
        } else {
          return {
            error: 'no authorization data found',
            code: 400,
          };
        }
      } catch (erorr) {
        throw erorr;
      }
    }
}
