import { Injectable } from '@nestjs/common';
import { NodeDto } from '../common/dtos/node.dto';
import { ClosureRepository } from '../common/repositories/closure.repository';
import { NodeRepository } from './repositories/nodes.repository';
import { RelashionshipKind } from '../common/types/literals';

@Injectable()
export class NodesService {
  constructor(
    private readonly closureRepository: ClosureRepository,
    private readonly nodeRepository: NodeRepository,
  ) {}

  async findRelateds(
    id: string,
    relashionship: RelashionshipKind,
  ): Promise<NodeDto[]> {
    const relations = await this.closureRepository.getNodeRelated(
      id,
      relashionship == 'ancestor' ? 'descendant' : 'ancestor',
    );
    const ids = relations.map((relation) => relation[relashionship]);
    const nodes = await this.nodeRepository.getNodesById(ids);

    const output: NodeDto[] = [];
    nodes.forEach((v) => {
      const depth = relations.find(
        (relation) => relation[relashionship] === v.id,
      )?.depth;
      if (!depth) return;
      output.push({
        name: v.name,
        id: v.id,
        depth: depth,
      });
    });
    return output.sort((a, b) => a.depth - b.depth);
  }
}
