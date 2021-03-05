import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpInput } from '../auth/dto/sign-up.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserInput: SignUpInput): Promise<UserEntity> {
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
    const data = await this.userRepository.findOne(id, {
      relations: ['todos'],
    });
    return data;
  }
}
