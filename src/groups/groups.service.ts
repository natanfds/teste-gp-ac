import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupResponseDto } from './dto/group-response.dto';
import { GroupRepository } from './repositories/group.repository';

@Injectable()
export class GroupsService {
  constructor(private readonly groupRepository: GroupRepository) {}
  async create(createGroupDto: CreateGroupDto): Promise<GroupResponseDto> {
    const node = await this.groupRepository.createNode(createGroupDto);
    return {
      ...node,
      type: 'GROUP',
    };
  }
}
