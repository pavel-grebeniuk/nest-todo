import { Module } from '@nestjs/common';

import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './models/category.entity';

import { CategoryQueryResolver } from './category.query.resolver';
import { CategoryResolver } from './category.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoryService, CategoryResolver, CategoryQueryResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
