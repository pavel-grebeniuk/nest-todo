import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './models/user.entity';
import { BasicService } from '../shared/services/basic.service';
import { UserRole } from './types/user-roles.enum';

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

  async changeRole(id: number, role: UserRole): Promise<UserEntity> {
    const user = await this.userRepository.preload({
      id,
      role,
    });
    if (!user) throw new NotFoundException();
    return this.userRepository.save(user);
  }
}
