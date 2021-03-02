import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const { DB_PORT, DB_HOST, DB_NAME, DB_USER, DB_PASS } = process.env;

const connection: ConnectionOptions = {
  port: parseInt(DB_PORT),
  host: DB_HOST,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASS,
  type: 'postgres',
  name: 'default',
  synchronize: false,
  migrationsRun: true,
  migrationsTableName: 'migrations_typeorm',
  entities: ['**/*.entity{ .ts,.js}'],
  migrations: ['migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'migrations',
  },
};

export = connection;
