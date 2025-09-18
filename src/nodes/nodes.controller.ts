import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodeDto } from 'src/common/dtos/node.dto';

@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get(':id/ancestors')
  async findAncestors(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<NodeDto[]> {
    return await this.nodesService.findRelateds(id, 'ancestor');
  }

  @Get(':id/descendants')
  async findDescendants(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<NodeDto[]> {
    return await this.nodesService.findRelateds(id, 'descendant');
  }
}
