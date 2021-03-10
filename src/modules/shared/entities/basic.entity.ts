import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BasicEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  createdAt?: Date;
}
