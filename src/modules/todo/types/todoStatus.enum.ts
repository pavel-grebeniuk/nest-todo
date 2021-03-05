import { registerEnumType } from '@nestjs/graphql';

export enum TodoStatus {
  NEW = 'NEW',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}
registerEnumType(TodoStatus, {
  name: 'TodoStatus',
});
