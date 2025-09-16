import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodeDto } from 'src/common/dtos/node.dto';

@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get(':id/ancestors')
  findAncestors(@Param('id', new ParseUUIDPipe()) id: string): NodeDto[] {
    return this.nodesService.findAncestors(id);
  }

  @Get(':id/descendants')
  findDescendants(@Param('id', new ParseUUIDPipe()) id: string): NodeDto[] {
    return this.nodesService.findDescendants(id);
  }
}
