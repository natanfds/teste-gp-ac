import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodesController } from './nodes.controller';
import { ClosureRepository } from '../common/repositories/closure.repository';
import { NodeRepository } from './repositories/nodes.repository';

@Module({
  controllers: [NodesController],
  providers: [NodesService, ClosureRepository, NodeRepository],
})
export class NodesModule {}
