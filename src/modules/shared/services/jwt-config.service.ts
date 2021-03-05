import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';

export class JwtConfigService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: this.configService.get<string>('TOKEN_EXPIRED_IN'),
      },
    };
  }
}
