import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './models/user.entity';
import { BasicService } from '../shared/services/basic.service';

@Injectable()
export class UserService extends BasicService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async getUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }
}
