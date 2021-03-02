import { IsOptional } from 'class-validator';

export class Upload {
  @IsOptional()
  buffer: Buffer;

  @IsOptional()
  encoding: string;

  @IsOptional()
  filename: string;

  @IsOptional()
  mimetype: string;
}
