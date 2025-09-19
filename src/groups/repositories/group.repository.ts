import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { CreateGroupDto } from '../dto/create-group.dto';
import { ClosureRepository } from '../../common/repositories/closure.repository';
import { nodeEntity } from '../../common/entities/node.entity';

@Injectable()
export class GroupRepository {
  constructor(
    @Inject('DB') private db: ReturnType<typeof drizzle>,
    private readonly closureRepository: ClosureRepository,
  ) {}

  async createNode(data: CreateGroupDto) {
    const [node] = await this.db
      .insert(nodeEntity)
      .values({
        name: data.name,
        parentId: data.parentId,
      })
      .returning();

    if (!node) throw new Error('Group not created');

    await this.closureRepository.create(node.id, node.parentId);

    return node;
  }
}
