import { ConfigService } from '@nestjs/config';
import { PubSub } from 'graphql-subscriptions';

export const PubSubProvider = {
  provide: 'PUB_SUB',
  useValue: new PubSub(),
  inject: [ConfigService],
};
