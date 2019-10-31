import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { CheckUserIfAdmin } from './helpers/check.user.if.admin';
import { AdminModule } from './admin/admin.module';
import { AdminController } from './admin/admin.controller';
// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  controllers: [AppController],
  imports: [UsersModule, AuthModule, AdminModule],
  // providers: [
  //   AdminService,
  // ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(CheckUserIfAdmin)
      .exclude({ path: 'admin/tweets', method: RequestMethod.GET})
      .forRoutes(AdminController);
  }
}
