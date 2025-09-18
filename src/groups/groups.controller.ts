import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupResponseDto } from './dto/group-response.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createGroupDto: CreateGroupDto): Promise<GroupResponseDto> {
    return this.groupsService.create(createGroupDto);
  }
}
