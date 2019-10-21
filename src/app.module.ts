import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { JwtMiddleware } from './helpers/jwt.middleware';
// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  controllers: [AppController],
  imports: [UsersModule, AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({path: 'users', method: RequestMethod.GET});
  }
}
