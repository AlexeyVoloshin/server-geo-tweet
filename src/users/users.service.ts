import { Inject, Injectable } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { json } from 'express';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll(): Promise<User> {
    return await this.userModel.find({}).exec();
  }

  /////////////////////////////////////////////////////

  async findOne(username: string): Promise<User | undefined> {
    return await this.userModel.findOne({ username });
  }

  async findUserById(_id: string): Promise<User> {
    return await this.userModel.findById(_id).exec();
  }

  // async getCurrentUser(): Promise<User> {
  //
  // return
  // }
}
