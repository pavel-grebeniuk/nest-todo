import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserInput } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserInput: CreateUserInput): Promise<UserEntity> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(createUserInput.password, salt);
    const user = await this.findUser(createUserInput.email);
    if (user) {
      throw new ConflictException(
        `User with email ${createUserInput.email} already exists`,
      );
    }
    const newUser = await this.userRepository.create({
      ...createUserInput,
      password: hash,
    });
    return this.userRepository.save(newUser);
  }

  async findUser(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  async getUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }
}
