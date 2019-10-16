import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  imports: [UsersModule],
})
export class AppModule {}
