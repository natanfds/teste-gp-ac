import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { nodeEntity } from '../../common/entities/node.entity';
import { inArray } from 'drizzle-orm';

@Injectable()
export class NodeRepository {
  constructor(@Inject('DB') private db: ReturnType<typeof drizzle>) {}

  public async getNodesById(ids: string[]) {
    if (ids.length === 0) return [];
    const output = await this.db
      .select()
      .from(nodeEntity)
      .where(inArray(nodeEntity.id, ids));
    return output;
  }
}
