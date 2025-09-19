import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersRepository } from './repositories/users.repository';
import { AssociateUserGroupDto } from './dto/associate-user-group.dto';
import { NodeDto } from '../common/dtos/node.dto';
import { DataConflict } from '../common/decorators/dataConflict';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  @DataConflict('Email already exists')
  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.create(data);
    return {
      ...user,
      type: 'USER',
    };
  }

  @DataConflict('Hierarchy combination already exists')
  async associateUserWithNode(
    userId: string,
    data: AssociateUserGroupDto,
  ): Promise<void> {
    await this.usersRepository.associateUserWithNode(userId, data);
  }

  async getUserOrganizations(userId: string): Promise<NodeDto[]> {
    const res = await this.usersRepository.getNodesWithUserId(userId);
    return res.filter((item) => item.depth > 0);
  }
}
