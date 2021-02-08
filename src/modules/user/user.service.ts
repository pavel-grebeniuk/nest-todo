import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './schemas/user.schema';
import { CreateUserInput } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(createUserInput.password, salt);
    const user = await this.findUser(createUserInput.email);
    if (user) {
      throw new ConflictException(
        `User with email ${createUserInput.email} already exists`,
      );
    }
    const createdUser = new this.userModel({
      ...createUserInput,
      password: hash,
    });
    return await createdUser.save();
  }

  async findUser(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }
}
