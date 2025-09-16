import { Injectable } from '@nestjs/common';
import { NodeDto } from 'src/common/dtos/node.dto';

@Injectable()
export class NodesService {
  findAncestors(id: string): NodeDto[] {
    return [];
  }

  findDescendants(id: string): NodeDto[] {
    return [];
  }
}
