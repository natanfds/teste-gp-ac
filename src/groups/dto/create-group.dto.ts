/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
