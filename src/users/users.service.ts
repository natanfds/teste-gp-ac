import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto): UserResponseDto {
    return {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      type: 'USER',
    };
  }
}
