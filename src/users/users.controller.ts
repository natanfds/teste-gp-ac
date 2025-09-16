import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssociateUserGroupDto } from './dto/associate-user-group.dto';
import { UserResponseDto } from './dto/user-response.dto';
import type { ListOfOrganizationsDto } from './dto/organization.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): UserResponseDto {
    return this.usersService.create(createUserDto);
  }

  @Post(':id/groups')
  associateGroup(
    @Body() associateGroupDto: AssociateUserGroupDto,
    @Param('id') id: string,
  ): string {
    return id;
  }

  @Get(':id/organizations')
  getOrganizations(@Param('id') id: number): ListOfOrganizationsDto {
    return [];
  }
}
