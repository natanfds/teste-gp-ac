import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { closureNodesEntity } from '../entities/closure-nodes.entity';
import { InferInsertModel, eq } from 'drizzle-orm';
import { RelashionshipKind } from '../types/literals';

@Injectable()
export class ClosureRepository {
  constructor(@Inject('DB') private db: ReturnType<typeof drizzle>) {}

  public async getNodeRelated(id: string, relashionship: RelashionshipKind) {
    const output = await this.db
      .select()
      .from(closureNodesEntity)
      .where(eq(closureNodesEntity[relashionship], id));
    return output;
  }

  public async create(nodeId: string, parentId: string | null): Promise<void> {
    let dataToInsert: InferInsertModel<typeof closureNodesEntity>[] = [];
    //self link
    dataToInsert.push({
      ancestor: nodeId,
      descendant: nodeId,
      depth: 1,
    });
    let relationsToInsert: InferInsertModel<typeof closureNodesEntity>[] = [];
    if (parentId) {
      relationsToInsert = await this.getNodeRelated(parentId, 'descendant');
      relationsToInsert = relationsToInsert.map((relation) => ({
        ancestor: relation.ancestor,
        descendant: nodeId,
        depth: relation.depth + 1,
      }));
      dataToInsert = dataToInsert.concat(relationsToInsert);
    }
    try {
      await this.db.insert(closureNodesEntity).values(dataToInsert);
    } catch (error) {
      console.log(error);
    }
  }
}
