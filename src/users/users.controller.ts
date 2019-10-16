import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User} from '../interfaces/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
   await this.usersService.create(createUserDto);
  }
  @Get()
  async findAll(): Promise<User> {
    return this.usersService.findAll();
  }
}
