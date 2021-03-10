import { DeepPartial, Repository } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';

import { PickProperty } from '../types/types';

export class BasicService<Entity> {
  constructor(protected repository: Repository<Entity>) {}

  createQueryBuilder: PickProperty<
    Repository<Entity>,
    'createQueryBuilder'
  > = this.repository.createQueryBuilder.bind(this.repository);
  createEntity: PickProperty<
    Repository<Entity>,
    'create'
  > = this.repository.create.bind(this.repository);
  save: PickProperty<Repository<Entity>, 'save'> = this.repository.save.bind(
    this.repository,
  );
  find: PickProperty<Repository<Entity>, 'find'> = this.repository.find.bind(
    this.repository,
  );
  findOne: PickProperty<
    Repository<Entity>,
    'findOne'
  > = this.repository.findOne.bind(this.repository);
  delete: PickProperty<
    Repository<Entity>,
    'delete'
  > = this.repository.delete.bind(this.repository);
  remove: PickProperty<
    Repository<Entity>,
    'remove'
  > = this.repository.remove.bind(this.repository);
  updateMany: PickProperty<
    Repository<Entity>,
    'update'
  > = this.repository.update.bind(this.repository);
  async create(data: DeepPartial<Entity>): Promise<Entity> {
    return this.repository.save(this.repository.create(data));
  }
  async update(data: DeepPartial<Entity>) {
    return this.repository.save(await this.repository.preload(data));
  }
  async distinct(field: keyof Entity, conditions?: FindConditions<Entity>) {
    return (await this.find(conditions)).reduce((acc, record) => {
      acc.add(record[field]);
      return acc;
    }, new Set());
  }
  findOneActive(conditions?: FindConditions<Entity>) {
    return this.findOne(conditions);
  }
}
