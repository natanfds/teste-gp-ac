/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsUUID } from 'class-validator';

export class AssociateUserGroupDto {
  @IsUUID()
  groupId: string;
}
