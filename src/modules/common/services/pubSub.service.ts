import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubSubService {
  private pubSub = new PubSub();
  subscribe(trigger: string) {
    return this.pubSub.asyncIterator(trigger);
  }
  publish(trigger: string, payload: any) {
    this.pubSub.publish(trigger, payload);
  }
}
