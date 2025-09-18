import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { userEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

import { AssociateUserGroupDto } from '../dto/associate-user-group.dto';
import { userNodesRelEntity } from 'src/common/entities/user-node-rel.entity';
import { NodeDto } from 'src/common/dtos/node.dto';
import { eq } from 'drizzle-orm';
import { nodeEntity } from 'src/common/entities/node.entity';
import { closureNodesEntity } from 'src/common/entities/closure-nodes.entity';
@Injectable()
export class UsersRepository {
  constructor(@Inject('DB') private db: ReturnType<typeof drizzle>) {}

  async create(data: CreateUserDto) {
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

    return dbRes[0];
  }

  async associateUserWithNode(
    userId: string,
    data: AssociateUserGroupDto,
  ): Promise<void> {
    await this.db.insert(userNodesRelEntity).values({
      user_id: userId,
      node_id: data.groupId,
    });
  }

  async getNodesWithUserId(userId: string): Promise<NodeDto[]> {
    const dbRes = await this.db
      .select({
        id: nodeEntity.id,
        name: nodeEntity.name,
        depth: closureNodesEntity.depth,
      })
      .from(userNodesRelEntity)
      .where(eq(userNodesRelEntity.user_id, userId))
      .innerJoin(
        closureNodesEntity,
        eq(closureNodesEntity.descendant, userNodesRelEntity.node_id),
      )
      .innerJoin(nodeEntity, eq(nodeEntity.id, closureNodesEntity.ancestor));

    return dbRes.map((item) => {
      const { id, name, depth } = item;
      if (!id || !name || typeof depth != 'number')
        throw new Error('Node data inconsistency');
      return {
        id,
        name,
        depth,
      };
    });
  }
}
