import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  controllers: [AppController],
  imports: [UsersModule, AuthModule],
})
export class AppModule {}
