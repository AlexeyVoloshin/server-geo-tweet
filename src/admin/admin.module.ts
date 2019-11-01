import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { geoProviders } from './admin.providers';
import { DatabaseModule } from '../database/database.module';
import { twitterProviders } from './twitter.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminController],
  providers: [AdminService, ...geoProviders, ...twitterProviders],
  exports: [AdminService],
})
export class AdminModule {}
