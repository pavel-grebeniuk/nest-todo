import { registerEnumType } from '@nestjs/graphql';

export enum TodoStatus {
  NEW,
  COMPLETED,
  EXPIRED,
}
registerEnumType(TodoStatus, {
  name: 'TodoStatus',
});
