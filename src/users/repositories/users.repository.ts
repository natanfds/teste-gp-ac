import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { userEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DB') private db: ReturnType<typeof drizzle>) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const dbRes = await this.db
      .insert(userEntity)
      .values({
        name: data.name,
        email: data.email,
      })
      .returning();
    if (!dbRes[0]) throw new Error('User not created');

    if (Object.values(dbRes[0]).some((value) => !value))
      throw new Error('User not created');

    return {
      id: dbRes[0].id,
      name: dbRes[0].name,
      email: dbRes[0].email,
      type: 'USER',
    };
  }
}
