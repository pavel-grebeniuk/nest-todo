import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

import { Media } from './models/media.entity';

@Resolver(() => Media)
export class MediaResolver {
  private serverUrl = this.config.get('SERVER_URL');

  constructor(private readonly config: ConfigService) {}

  @ResolveField()
  async url(@Parent() media: Media) {
    return `${this.serverUrl}/files/${media.url}`;
  }
}
