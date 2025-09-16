import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupResponseDto } from './dto/group-response.dto';

@Injectable()
export class GroupsService {
  create(createGroupDto: CreateGroupDto): GroupResponseDto {
    return {
      id: '1',
      name: 'Group 1',
      parentId: '1',
      type: 'GROUP',
    };
  }
}
