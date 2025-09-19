import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssociateUserGroupDto } from './dto/associate-user-group.dto';
import { UserResponseDto } from './dto/user-response.dto';
import type { NodeListDto } from '../common/dtos/node.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const creationRes = await this.usersService.create(createUserDto);
    return creationRes;
  }

  @Post(':id/groups')
  @HttpCode(204)
  async associateGroup(
    @Body() associateGroupDto: AssociateUserGroupDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<string> {
    await this.usersService.associateUserWithNode(id, associateGroupDto);
    return 'ok';
  }

  @Get(':id/organizations')
  async getOrganizations(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<NodeListDto> {
    return await this.usersService.getUserOrganizations(id);
  }
}
