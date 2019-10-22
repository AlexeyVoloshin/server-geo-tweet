import { Controller, Get } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get()
  findAll(): string {
    return 'This action admin';
  }
}
