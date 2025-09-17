import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssociateUserGroupDto } from './dto/associate-user-group.dto';
import { UserResponseDto } from './dto/user-response.dto';
import type { NodeListDto } from 'src/common/dtos/node.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Post(':id/groups')
  associateGroup(
    @Body() associateGroupDto: AssociateUserGroupDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): string {
    return id;
  }

  @Get(':id/organizations')
  getOrganizations(@Param('id', new ParseUUIDPipe()) id: string): NodeListDto {
    return [];
  }
}
